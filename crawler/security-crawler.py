import requests
from bs4 import BeautifulSoup
import argparse
from urllib.parse import urljoin
import json
from tqdm import tqdm

def main(target_url, keyword, year, publication):
    # 发送请求获取页面内容
    response = requests.get(target_url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # 提取特定链接
    links = soup.find_all('a', href=True)  # 找到所有链接
    specific_links = [link['href'] for link in links if keyword in link['href']]  # 根据关键字筛选链接

    # 去重集合
    visited_links = set()

    # 存储所有结果的列表
    results = []

    # 遍历特定链接，提取信息，并显示进度条
    for link in tqdm(specific_links, desc="正在爬取链接", unit="链接"):
        full_link = urljoin(target_url, link)  # 使用urljoin处理相对链接

        # 检查链接是否已访问过
        if full_link in visited_links:
            continue

        # 标记为已访问
        visited_links.add(full_link)

        try:
            link_response = requests.get(full_link)
            link_response.raise_for_status()  # 检查请求是否成功
            link_soup = BeautifulSoup(link_response.text, 'html.parser')

            # 提取所需的信息
            if publication == 'security':
                title = link_soup.select_one('#page-title').get_text(strip=True) if link_soup.select_one('#page-title') else '无标题'
                abstract = link_soup.select_one('.field-name-field-paper-description').get_text(strip=True) if link_soup.select_one('.field-name-field-paper-description') else '无摘要'
                author = link_soup.select_one('.field-name-field-paper-people-text').get_text(strip=True) if link_soup.select_one('.field-name-field-paper-people-text') else '无作者信息'
            elif publication == 'ccs':
                title = link_soup.select_one('h1[property=name]').get_text(strip=True) if link_soup.select_one('h1[property=name]') else '无标题'
                abstract = link_soup.select_one('section#abstract').get_text(strip=True) if link_soup.select_one('section#abstract') else '无摘要'
                author = link_soup.select_one('div.contributors').get_text(strip=True) if link_soup.select_one('div.contributors') else '无作者信息'
            elif publication == 'ndss':
                title = link_soup.select_one('h1.entry-title').get_text(strip=True) if link_soup.select_one('h1.entry-title') else '无标题'
                abstract = link_soup.select_one('div.paper-data').get_text(strip=True) if link_soup.select_one('div.paper-data') else '无摘要'
                author = link_soup.select_one('div.entry-content strong').get_text(strip=True) if link_soup.select_one('div.entry-content strong') else '无作者信息'
                # 把author部分替换掉
                abstract = abstract.replace(author, "").strip()
            else:
                print("不支持的刊物类型")
                break

            if title == "无标题":
                print(full_link, "无效链接")
                continue

            # 构建 JSON 对象
            result = {
                'title': title,
                'abstract': abstract,
                'author': author,
                'year': year,
                'publication': publication,
                'link': full_link,
                'comment': '',
            }
            results.append(result)

        except requests.RequestException as e:
            print(f'请求错误: {e} | 链接: {full_link}')

    # 保存结果为 JSON 文件
    output_filename = f"{publication}-{year}.json"
    with open(output_filename, 'w', encoding='utf-8') as json_file:
        json.dump(results, json_file, ensure_ascii=False, indent=2)

    print(f"数据已保存到 {output_filename}")

if __name__ == "__main__":
    # 创建解析器
    parser = argparse.ArgumentParser(description='爬取特定URL中的链接并提取信息')
    parser.add_argument('-t', '--target-url', type=str, required=True, help='目标页面的URL')
    parser.add_argument('-k', '--keyword', type=str, required=True, help='用于过滤链接的关键词')
    parser.add_argument('-y', '--year', type=str, required=True, help='发表年份')
    parser.add_argument('-p', '--publication', type=str, required=True, help='发表刊物/会议')

    # 解析命令行参数
    args = parser.parse_args()

    # 调用主函数
    main(args.target_url, args.keyword, args.year, args.publication)
