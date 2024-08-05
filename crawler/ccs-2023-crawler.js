// https://www.sigsac.org/ccs/CCS2023/tocs/tocs-ccs23.html
// 初始化结果数组
const results = [];

// 获取所有h5元素
const h5Elements = document.querySelectorAll('h5');

// 遍历每个h5元素
h5Elements.forEach(h5 => {
    // 提取标题和链接
    const titleElement = h5.querySelector('a');
    const title = titleElement ? titleElement.textContent.trim() : '无标题';
    const link = titleElement ? titleElement.href : '';

    // 获取并提取作者
    const nextUl = h5.nextElementSibling;
    let authors = '';
    if (nextUl && nextUl.tagName === 'UL') {
        authors = Array.from(nextUl.children).map(author => author.textContent.trim()).join(', ');
    }

    // 获取摘要
    const abstracts = [];
    let nextElement = nextUl ? nextUl.nextElementSibling : null;
    while (nextElement && nextElement.tagName === 'P') {
        abstracts.push(nextElement.textContent.trim());
        nextElement = nextElement.nextElementSibling;
    }
    const abstract = abstracts.join(' '); // 将多个摘要合并为一个字符串

    // 构建JSON对象
    const result = {
        title: title,
        author: authors,
        abstract: abstract,
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
