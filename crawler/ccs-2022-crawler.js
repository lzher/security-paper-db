// 初始化结果数组
const results = [];

// 提取所有标题
const titleElements = document.querySelectorAll('h3 a');
const titles = Array.from(titleElements).map(titleElement => ({
    title: titleElement.textContent.trim(),
    link: titleElement.href // 提取链接
}));

// 提取所有作者
const authorElements = document.querySelectorAll('ul.DLauthors');
const authorsList = Array.from(authorElements).map(authorsElement => {
    return Array.from(authorsElement.children).map(author => author.textContent.trim()).join(', ');
});

// 提取所有摘要
const abstractElements = document.querySelectorAll('div.DLabstract');
const abstracts = Array.from(abstractElements).map(abstractElement => abstractElement.textContent.trim());

// 确保所有数组长度一致
const maxLength = Math.min(titles.length, authorsList.length, abstracts.length);

// 构建 JSON 对象
for (let i = 0; i < maxLength; i++) {
    results.push({
        title: titles[i].title,
        author: authorsList[i],
        abstract: abstracts[i],
        year: '2022',
        publication: 'ccs',
        link: titles[i].link,
        comment: ''
    });
}

// 打印结果
console.log(JSON.stringify(results, null, 2));
