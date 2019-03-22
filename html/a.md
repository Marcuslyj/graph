## return false vs javascript:;
有时候，我们需要在网页中使用一个不带任何功能的a标签，实现方式有如下两种
```html
    <a href="#" onclick="return false">link</a>
    <a href="javascript:;">link</a>
```
为什么有这两种写法，他们的优缺点分别是什么呢？

这就要从那个IE6被称为Moden Browser的时代说起了。哎，暴露年龄了。

那时用css写hover效果，不是你想写就能写的。IE6只支持a标签的:hover伪类。于是乎切图仔们就纷纷用a标签套在要hover的元素上面。

可是如果a标签的href为空，IE还是不支持hover效果。切图仔们只能硬往href上加个值，还不能让a标签点击后有不符合预期的效果。

加上javascript:;告诉浏览器，点击以后触发一段js脚本，脚本内容为空。就等于a标签点击没有效果了。

但Moden的IE6，会在点击之后停止页面的GIF动画。

另一个方案就是href="#"，再通过onclick="return false"的方式阻止浏览器默认事件。这样基本就解决了IE6下hover的问题。

所以那个年代，还是更推崇使用return false的方式。

如今来说，挑选你喜欢的方式即可，浏览器都能很好的兼容。
### return false的注意事项
如果采用return false的方式，尽量在onclick中只有return false；
下面的方式，在return false之前加了一些逻辑
```html
    <a href="#" onclick="doSome();return false"></a>
```
需要格外小心，因为如果doSome()执行报错了，就会导致页面滚动到顶部并且url上有个难看的#

如果用户在a标签上点击右键，选择【在新标签页中打开链接】，浏览器还是会打开一个新页面的，此时return false就没用了。所以如果可能，尽量给href一个符合预期的链接。

### javascript:;的注意事项
这种方法如果用户在a标签上右键，选择【在新标签页中打开链接】，会打开一个空白页面。
## 四个伪类
## href的特殊用途
