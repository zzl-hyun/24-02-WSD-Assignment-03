import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random

def crawl_corp_info():
    """
    사람인 채용공고 링크 기반 회사정보 크롤링

    Returns:
        DataFrame: 모든 키워드의 회사 정보가 담긴 데이터프레임
    """
    jobs = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Referer': 'https://www.saramin.co.kr/zf_user/jobs/relay/view',
        'Origin': 'https://www.saramin.co.kr',
        'X-Requested-With': 'XMLHttpRequest'
    }
    
    # CSV 파일 읽기
    csv = pd.read_csv('jobs.csv', delimiter=',')
    links = csv[['회사명','링크']]
    existing_corps = set()

    
    for _, row in links.iterrows():
        company_name = row['회사명']
        link = row['링크']
        
        # 회사명이 이미 처리된 경우 건너뛰기
        if company_name in existing_corps:
            continue
        try:
            # 링크에서 rec_idx 추출
            if "rec_idx=" in link:
                rec_idx = link.split("rec_idx=")[-1].split("&")[0]
                # print(f"추출된 rec_idx: {rec_idx}")
            else:
                print("rec_idx를 링크에서 찾을 수 없습니다.")
                continue
            
            # rec_idx를 사용해 Ajax 데이터 가져오기
            payload = {
                'rec_idx': rec_idx,
                'rec_seq': '0',
                'utm_source': '',
                'utm_medium': '',
                'utm_term': '',
                'utm_campaign': '',
                'view_type': 'search',
                't_ref': '',
                'searchword': '',  # 추가된 필드
                'searchType': 'search',  # 추가된 필드
            }
            ajax_url = "https://www.saramin.co.kr/zf_user/jobs/relay/view-ajax"
            response = requests.post(ajax_url, headers=headers, data=payload)
            response.raise_for_status()  # 에러 발생 시 예외 처리

            # # 응답 저장 (디버깅용)
            # with open("response_ajax.html", "w", encoding="utf-8") as file:
            #     file.write(response.text)
            
            # Ajax 응답 파싱
            soup = BeautifulSoup(response.text, 'html.parser')
            info_area = soup.select_one('div.info_area')
            
            if not info_area:
                print("cant find")
                continue

             # 항목 추출
            representative_name = None
            company_type = None
            industry = None
            employee_count = None
            establishment_date = None
            revenue = None
            homepage = None
            company_address = None
            company_name = soup.select_one('.tit_area .basic_info  h3  a').text.strip()

            

            items = info_area.find_all('dl')
            for item in items:
                dt = item.find('dt')
                dd = item.find('dd')
                if not dt or not dd:
                    continue

                key = dt.get_text(strip=True)
                value = dd.get_text(strip=True)
                # 키 값에 따라 변수에 저장
                if "대표자명" in key:
                    representative_name = value
                elif "기업형태" in key:
                    company_type = value
                elif "업종" in key:
                    industry = value
                elif "사원수" in key:
                    employee_count = value
                elif "설립일" in key:
                    establishment_date = value
                elif "매출액" in key:
                    revenue = value
                elif "홈페이지" in key:
                    homepage = dd.find('a').get('href') if dd.find('a') else value
                elif "기업주소" in key:
                    company_address = value
                
            
            print(company_name)
            jobs.append({
                '회사명': company_name,
                '대표자명': representative_name,
                '기업형태': company_type,
                '업종': industry,
                '사원수': employee_count,
                '설립일': establishment_date,
                '매출액': revenue,
                '홈페이지': homepage,
                '기업주소': company_address
            })
            existing_corps.add(company_name)

        except requests.exceptions.RequestException as e:
            print(f"HTTP 요청 중 에러 발생: {e}")
        except Exception as e:
            print(f"일반적인 에러 발생: {e}")
        
        delay = random.uniform(0.5, 2.0)
        time.sleep(delay)
    # 결과를 데이터프레임으로 변환
    df = pd.DataFrame(jobs)
    return df

# 함수 실행
df = crawl_corp_info()

# 결과 저장
df.to_csv('saramin_corp_info.csv', index=False, encoding='utf-8-sig')
