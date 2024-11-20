import argparse
import json
import bibtexparser

def parse_bibtex(bibtex_content, year, publication):
    results = []

    # 解析 BibTeX 内容
    bib_data = bibtexparser.loads(bibtex_content)

    for entry in bib_data.entries:
        # 提取所需字段
        title = entry.get('title', '无标题').strip()
        author = entry.get('author', '无作者信息').strip()
        abstract = entry.get('abstract', '无摘要').strip()
        url = entry.get('url', '无链接').strip()

        # 创建 JSON 对象
        result = {
            'title': title,
            'author': author,
            'abstract': abstract,
            'year': year,
            'publication': publication,
            'link': url,
            'comment': ''
        }
        results.append(result)

    return results

def main(input_file, year, publication):
    # 读取 BibTeX 文件内容
    with open(input_file, 'r', encoding='utf-8') as file:
        bibtex_content = file.read()

    # 解析 BibTeX 内容
    json_results = parse_bibtex(bibtex_content, year, publication)

    # 保存结果为 JSON 文件
    output_filename = f"{publication}-{year}.json"
    with open(output_filename, 'w', encoding='utf-8') as json_file:
        json.dump(json_results, json_file, ensure_ascii=False, indent=2)

    print(f"数据已保存到 {output_filename}")

if __name__ == "__main__":
    # 创建解析器
    parser = argparse.ArgumentParser(description='提取 BibTeX 条目并转换为 JSON 格式')
    parser.add_argument('-f', '--file', type=str, required=True, help='包含 BibTeX 条目的文件名')
    parser.add_argument('-y', '--year', type=str, required=True, help='发表年份')
    parser.add_argument('-p', '--publication', type=str, required=True, help='发表刊物/会议')

    # 解析命令行参数
    args = parser.parse_args()

    # 调用主函数
    main(args.file, args.year, args.publication)
