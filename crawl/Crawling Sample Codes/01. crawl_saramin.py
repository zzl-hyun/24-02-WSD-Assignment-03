import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import time


def crawl_saramin(keywords, pages=5):
    """
    사람인 채용공고를 키워드별로 크롤링하는 함수 (중복 제거 포함)

    Args:
        keywords (list): 검색할 키워드 리스트
        pages (int): 각 키워드별로 크롤링할 페이지 수

    Returns:
        DataFrame: 모든 키워드의 채용공고 정보가 담긴 데이터프레임
    """
    jobs = []
    existing_links = set()  # 중복 방지를 위한 링크 집합
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    for keyword in keywords:
        print(f"키워드 '{keyword}'로 크롤링 시작")
        for page in range(1, pages + 1):
            url = f"https://www.saramin.co.kr/zf_user/search/recruit?searchword={keyword}&recruitPage={page}"
            try:
                response = requests.get(url, headers=headers)
                # print(response.status_code, response.text)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')

                # 채용공고 목록 가져오기
                job_listings = soup.select('.item_recruit')

                for job in job_listings:
                    try:
                        # 채용 링크 (고유 식별자)
                        link = 'https://www.saramin.co.kr' + job.select_one('.job_tit a')['href']

                        # 중복 데이터인지 확인
                        if link in existing_links:
                            continue
                        

                        # 회사명
                        company_name = job.select_one('.corp_name a').text.strip()
                        # 회사명 초기화



                        # 채용 제목
                        title = job.select_one('.job_tit a').text.strip()

                        # 지역, 경력, 학력, 고용형태
                        conditions = job.select('.job_condition span')
                        location = conditions[0].text.strip() if len(conditions) > 0 else ''
                        experience = conditions[1].text.strip() if len(conditions) > 1 else ''
                        education = conditions[2].text.strip() if len(conditions) > 2 else ''
                        employment_type = conditions[3].text.strip() if len(conditions) > 3 else ''
                        salary = conditions[4].text.strip() if len(conditions) > 4 else ''
                        if salary == '':
                            continue

                        # 마감일
                        deadline = job.select_one('.job_date .date').text.strip()

                        # 직무 분야
                        job_sector = job.select_one('.job_sector')
                        sector = job_sector.text.strip() if job_sector else ''
                        date = job.select_one('.job_sector .job_day').text.strip()
                        # 평균연봉 정보 (있는 경우)
                        salary_badge = job.select_one('.area_badge .badge')
                        benefit = salary_badge.text.strip() if salary_badge else ''

                        # 데이터 저장
                        jobs.append({
                            '키워드': keyword,
                            '회사명': company_name,
                            '제목': title,
                            '링크': link,
                            '지역': location,
                            '경력': experience,
                            '학력': education,
                            '연봉': salary,
                            '고용형태': employment_type,
                            '마감일': deadline,
                            '직무분야': sector,
                            '연봉정보': benefit,
                            '등록일': date
                        })

                        # 중복 방지를 위해 링크 추가
                        existing_links.add(link)

                    except AttributeError as e:
                        print(f"항목 파싱 중 에러 발생: {e}")
                        continue

                print(f"'{keyword}' 키워드 {page}페이지 크롤링 완료")
                time.sleep(2)  # 서버 부하 방지를 위한 딜레이

            except requests.RequestException as e:
                print(f"'{keyword}' 키워드 {page}페이지 요청 중 에러 발생: {e}")
                continue

    return pd.DataFrame(jobs)


# 사용 예시
if __name__ == "__main__":
    # 키워드 리스트
    keywords = ['python', 'c언어','c%2B%2B','C', 'java', 'IT개발·데이터', '웹개발' '백엔드/서버개발', '게임개발', '앱개발']
    # keywords = ['python']

    # 각 키워드별로 5페이지씩 크롤링
    df = crawl_saramin(keywords, pages=10)

    # 결과를 CSV로 저장
    df.to_csv('saramin_jobs_unique.csv', index=False)
    print("크롤링 결과가 'saramin_jobs_unique.csv'에 저장되었습니다.")
#content > div.wrap_jview > section.jview.jview-0-49149439 > div.wrap_jv_cont > div.jv_cont.jv_summary > div > div.meta > ul > li:nth-child(1) > strong