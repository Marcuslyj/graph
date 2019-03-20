![Meta标签](../imgs/meta.jpg)
## 关键知识点
```html
    <meta charset="UTF-8">
```
用来描述网页的字符编码，建议放在head标签的第一行。因为如果在它之前出现了其他中文，如title标签中有中文，可能会导致中文乱码。
```html
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
```
防止高版本的IE浏览器使用IE7模式，这个必须放在任何script标签前面，否则会不起作用。

## 描述
meta的全称是metadata。中文翻译为元数据。

英文的描述为：
> The &lt;meta&gt; tag provides metadata about the HTML document. Metadata will not be displayed on the page, but will be machine parsable.

关键信息为两点

1. meta不在页面中展示
2. 机器会去解析meta标签

对它用处的英文描述是：
> Meta elements are typically used to specify page description, keywords, author of the document, last modified, and other metadata.

翻译成中文就是说用来定义页面的说明、关键字、作者、最后修改时间等元信息来让机器识别，包括浏览器和爬虫等。

## 需要特殊关注的meta
```html
    <meta charset="UTF-8"><!--用来描述网页的字符编码，建议放在head标签的第一行。因为如果在它之前出现了其他中文，如title标签中有中文，可能会导致中文乱码。-->
    <meta http-equiv="X-UA-Compatible" content="ie=edge"><!--防止高版本的IE浏览器使用IE7模式，这个必须放在任何script标签前面，否则会不起作用。-->
```
## 常用的meta
```html
    <meta name="keywords" content="关键字1,关键字2"><!-- 用于SEO，告诉搜索引擎，网页的关键字信息。 -->
    <meta name="description" content="网页内容的摘要描述"><!-- 用于SEO，告诉搜索引擎，网页的摘要信息。 -->
    <meta name="robots" content="none"><!--
        如同robots.txt，这个meta标签是一个事实上的标准，用来告诉搜索引擎爬虫，此页面的爬取规则，content属性有："INDEX", "NOINDEX", "FOLLOW", "NOFOLLOW"，可以通过逗号组合多个，但只有部分组合有效。
        INDEX,FOLLOW 默认值，检索本页和外链
        NOINDEX, FOLLOW 不检索本页，但检索外链
        INDEX, NOFOLLOW 检索本页，但不检索外链
        NOINDEX, NOFOLLOW 不检索本页和外链
        NONE NOINDEX,NOFOLLOW的简写
        ALL INDEX,FOLLOW的简写
        -->
    <!--以下为移动端专用meta-->
    <meta name ="viewport" content ="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no"><!--移动端viewport设置-->
    <meta name="format-detection" content="telephone=no" /> <!-- 禁止数字识自动别为电话号码 -->
```
详细可参考[HTML 常用头部标签（meta）](http://www.runoob.com/w3cnote/html-meta-intro.html)