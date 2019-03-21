## 关键知识点
Src(Source)：表示当前元素真实内容的链接

href(Hypertext Reference)：表示对某个外部资源的引用或者关系

## src案例
```html
    <!--这里的src就是指图片内容的链接。当src的内容加载完成时，就成为了该img标签的显示内容-->
    <img alt="这是一个图片" src="img.jpg"/>

    <!--这里的src就代表了js内容的链接，你也可以把内容直接写到script标签内部，与用src无区别(除了需要网络加载外)
        并且js内部相对地址，也是相对于当前页面的
    -->
    <script type="text/javascript" src="script.js"></script>

    <!--同理，src表示的就是video的内容-->
    <video src="video.mp4"></video>
```

## href案例
```html
    <!--这里只是表示了引用了另外的一个资源。css的内容本身并非link标签的内容
        也许这也解释了为什么外链css中相对地址是相对于css文件的，而非当前页面的
    -->
    <link rel="stylesheet" href="style.css"/>

    <!--这里的href代表了目标链接与当前页面的关系。同样也并非是a标签的内容-->
    <a href="target.html">这是链接</a>
```

## 猜想
据说在XHTML2中，将src属性扩充到了所有元素，style也可以如下写
```html
    <style src="style.css"></style>
```
本人没有尝试，但我推测，这样写与link的最大区别，应该就是css文件中相对url的基准会不同吧。