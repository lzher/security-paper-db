// https://www.sigsac.org/ccs/CCS2023/tocs/tocs-ccs23.html
// 初始化结果数组
const results = [];

// 选择所有的 h5 标签
const titleElements = document.querySelectorAll('h5 a');

titleElements.forEach(titleElement => {
    // 提取标题和链接
    const title = titleElement.textContent.trim();
    const link = titleElement.href;

    // 找到并提取对应的作者
    const authorsList = titleElement.closest('h5').nextElementSibling; // 获取h5下一个兄弟元素
    let authors = '';

    if (authorsList && authorsList.tagName === 'UL') {
        authors = Array.from(authorsList.children).map(author => author.textContent.trim()).join(', '); // 用逗号连接作者
    } else {
        authors = '无作者信息'; // 如果没有找到作者
    }

    // 找到并提取摘要
    const abstractElements = titleElement.closest('h5').parentElement.querySelectorAll('p'); // 获取h5的父元素中的所有p标签
    const abstracts = Array.from(abstractElements).map(abstract => abstract.textContent.trim()).join(' '); // 将多个p标签的内容连接起来

    // 构建 JSON 对象
    const result = {
        title: title,
        author: authors,
        abstract: abstracts,
        year: '2023',
        publication: 'ccs',
        link: link,
        comment: ''
    };

    // 将结果添加到数组中
    results.push(result);
});

// 打印结果
console.log(JSON.stringify(results, null, 2));
