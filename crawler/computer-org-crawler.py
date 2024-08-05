# go to https://www.computer.org/csdl/proceedings/sp/2024/1RjE8VKKk1y, and "generate citations"
# for sp, icse
# sp: 
# icse: https://www.computer.org/csdl/proceedings/10548016
import json
import argparse
import re

def parse_entries(entries, year, publication):
    results = []

    # 正则表达式用于提取信息
    entry_pattern = re.compile(
        r'^(?P<authors>.+?),\s+"(?P<title>.+?),".+\n'
        r'doi:.*\n'
        r'keywords:.*\n'
        r'Abstract:\s+(?P<abstract>.+?)\s*\n'
        r'url:\s+(?P<link>.+)$',
        re.DOTALL | re.MULTILINE
    )

    for entry in entries.strip().split('\n\n'):
        match = entry_pattern.match(entry)
        if match:
            # 提取信息
            authors = match.group('authors')
            title = match.group('title')
            abstract = match.group('abstract').strip()
            link = match.group('link').strip()
            
            # 构建 JSON 对象
            result = {
                'author': authors,
                'title': title,
                'abstract': abstract,
                'year': year,
                'publication': publication,
                'link': link,
                'comment': ''
            }
            results.append(result)

    return results

def main(input_file, year, publication):
    # 从文件读取输入的条目
    with open(input_file, 'r', encoding='utf-8') as file:
        input_data = file.read()

    # 解析输入的条目
    json_results = parse_entries(input_data, year, publication)

    # 输出结果为 JSON 格式
    output_filename = f"{publication}-{year}.json"
    with open(output_filename, 'w', encoding='utf-8') as json_file:
        json.dump(json_results, json_file, ensure_ascii=False, indent=2)

    print(f"数据已保存到 {output_filename}")

if __name__ == "__main__":
    # 创建解析器
    parser = argparse.ArgumentParser(description='将条目转换为JSON格式')
    parser.add_argument('-f', '--file', type=str, required=True, help='输入条目数据的文件名')
    parser.add_argument('-y', '--year', type=str, required=True, help='发表年份')
    parser.add_argument('-p', '--publication', type=str, required=True, help='发表刊物/会议')

    # 解析命令行参数
    args = parser.parse_args()

    # 调用主函数
    main(args.file, args.year, args.publication)
