# cocos_demo
网页小游戏 火枪手大作战

游戏的图片、音乐等资源来自经典塔防游戏王国保卫战（Kingdom Rush）， 原作者为乌拉圭的铁皮工作室（Ironhide Game Studio）。本程序仅用于学习，勿作其他用途。

玩法与原作略有不同，这是一款没有塔的塔防游戏， 玩家需要操作英雄、招募盟友来击退敌人的进攻，消灭boss获得胜利。

运行环境：浏览器（由于没有部署到公网，需要先启动本地服务器）

开发环境：Cocos Creator  开发语言：JavaScript

Authored in 2019

***

### 游戏截图
![img](https://github.com/lichengchen/cocos_demo/blob/main/pics/p1.png)

![img](https://github.com/lichengchen/cocos_demo/blob/main/pics/p2.png)

![img](https://github.com/lichengchen/cocos_demo/blob/main/pics/p4.png)

![img](https://github.com/lichengchen/cocos_demo/blob/main/pics/p5.png)

***

### 操作教程
- 鼠标右键  移动
- 鼠标左键  普攻射击（仅6方向）
- Q 强化下次射击，炮弹速度、伤害翻倍
- W 向指定的任意方向发射多枚导弹，同时可移动（马可一梭子？）
- E 陷阱：布置一个静止的限时炮弹
- R 全屏轰炸，冷却较长
- 鼠标悬停在单位（盟友、敌人、小动物）、技能图标、地图元素上，可显示提示信息

***

### 实现思路简介
用cocos框架规定的树状挂载方式布局要显示的渲染元素。用框架的“分类”功能区分三个类：盟友、敌人、炮弹。 玩家操作的英雄实际上不会与敌人直接交互，只能根据玩家输入产生不同的炮弹。用框架的碰撞盒子功能， 定义炮弹类和敌人类的碰撞、盟友类和敌人类的碰撞。用挂载的JS文件描述每个类中对象的行为，如播放特定动画、 运动、与其他对象通信、构造新的对象、析构等。
