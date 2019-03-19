DOCTYPE的全称为Document Type Declaration

所有的html都需要一个DOCTYPE声明，并写在文档的开始。

DOCTYPE并不是一个HTML标签。浏览器通过DOCTYPE来决定如何理解文档，采用哪个HTML版本（标准或其他）来渲染页面。

常用的HTML5 DOCTYPE声明如下（不区分大小写）

```html
<!DOCTYPE html>
```
## HTML5与HTML4 DOCTYPE声明的差异
在HTML 4.01 中，DOCTYPE 声明引用DTD，因为HTML 4.01 基于SGML。DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容。

在HTML4.01中有三种DOCTYPE声明。

**严格模式：**
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"  "http://www.w3.org/TR/html4/strict.dtd">
```

**过渡模式：**
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"  "http://www.w3.org/TR/html4/loose.dtd">
```
**框架模式：**
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN"  "http://www.w3.org/TR/html4/frameset.dtd">
```
HTML5不基于SGML，所以不需要引用DTD。在HTML5中<!DOCTYPE>只有一种
```html
<!DOCTYPE html>
```
在此种文档模式下，IE6&7中会触发近乎标准模式，IE8以后的版本以及所有现代浏览器中都会触发标准模式。

因此一般情况下，只需要这样声明即可。

但在IE10及以下IE浏览器中，需要在&lt;head&gt;中,在任何脚本之前，增加一个特殊的meta标签，来防止触发**怪异模式**
```html
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
```
## 浏览器渲染模式
前面提到了**怪异模式(quirks mode)**，何为怪异模式，还有其他模式吗？

