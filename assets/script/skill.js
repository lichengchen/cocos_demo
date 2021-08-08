// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        cd : 5,
        current_cd : 0,
        sname: 'a',
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //this.currrent_cd = this.cd;
        this.node.on(cc.Node.EventType.MOUSE_ENTER,this.on_mouse_enter,this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,this.on_mouse_leave,this);
        this.node.on('setCD0', this.setCD0, this);
        
        this.enermyInfoNode = Global.infoNode.getChildByName('enermyInfoNode');
        this.skillLabelNode = Global.infoNode.getChildByName('label_skill');
        this.nameLabel = Global.infoNode.getChildByName('label_name').getComponent(cc.Label);
        this.cdLabel = this.skillLabelNode.getChildByName('label_cd').getComponent(cc.Label);

        if(this.sname=='q' || this.sname=='w' || this.sname=='e' || this.sname=='r' || this.sname == 'm' || this.sname == 'n'|| this.sname == 'N'){
            this.schedule(this.handleCD, 0.1);
        }
    },

    start () {
        this.showing = false;
    },

    handleCD: function() {
        if(this.current_cd<this.cd){
            this.current_cd+=0.1;
            this.node.opacity = 210;
            this.node.getComponent(cc.Sprite).fillRange = -this.current_cd / this.cd;
        }
        else{
            this.node.opacity = 255;
            this.node.getComponent(cc.Sprite).fillRange = -1;
        }
        if(this.showing){
            this.cdLabel.string = Math.floor(this.current_cd * 10) / 10 + '/' + this.cd;
        }
    },

    setCD0: function () {
        this.current_cd = 0;
    },

    on_mouse_enter: function() {
        this.showing = true;
        this.show_info();
    },

    on_mouse_leave: function() {
        this.enermyInfoNode.opacity = 0;
        this.skillLabelNode.opacity = 255;
        this.skillLabelNode.getComponent(cc.Label).string = '移动鼠标到单位/技能上来查看说明';
        this.nameLabel.string = '提示';
        this.cdLabel.string = '';
        this.showing = false;
    },

    show_info: function() {
        var name = '';
        var des = '';
        
        switch(this.sname){
            case 'a':{
                name = '鼠标左键';
                des = '火枪手射击，共6种方向';
                break;
            }
            case 'b':{
                name = '鼠标右键';
                des = '火枪手移动';
                break;
            }
            case 'q':{
                name = 'Q：致命狙击';
                des = '下次攻击射程、子弹速度、伤害大幅提高';
                break;
            }
            case 'w':{
                name = 'W: 导弹弹幕';
                des = '向指定的任意方向发射 8 枚导弹';
                break;
            }
            case 'e':{
                name = 'E：炸弹陷阱';
                des = '布置一个静止的炮弹作为陷阱';
                break;
            }
            case 'r':{
                name = 'R：天降正义';
                des = '呼叫空军支援,进行毁灭式轰炸';
                break;
            }
            case 'l':{
                name = '生命值';
                des = '让敌人成功通过道路就会扣除,减为零游戏结束';
                break;
            }
            case 'p':{
                name = '得分';
                des = '消灭敌人获得得分';
                break;
            }
            case 'c':{
                name = '金钱';
                des = '消灭敌人可获得与敌人生命值等量的金钱\n使用金钱可以招募盟友';
                break;
            }
            case 'm':{
                name = '伐木人的小屋';
                des = 'M键：消耗100金钱招募狂战士盟友';
                break;
            }
            case 'n':{
                name = '近卫军的城堡';
                des = 'N键：消耗100金钱招募近卫军盟友';
                break;
            }
            case 'N':{
                name = '近卫军的城堡';
                des = 'N键：消耗100金钱招募近卫军盟友\nB键：消耗1000金钱招募不死骑士';
                break;
            }
            case 'i':{
                name = '提示';
                des = '鼠标中键可以吸引更多的敌人\n得分达到50,出现Boss';
                break;
            }
            case 'j':{
                name = '提示';
                des = '鼠标中键可以吸引更多的敌人\n得分增至50的倍数,出现Boss';
                break;
            }
            case 'k':{
                name = '战场效果';
                des = '首领的鼓舞：每一个Boss使之后所有新出现的敌人生命值翻倍';
                break;
            }
        }
        this.enermyInfoNode.opacity = 0;
        this.skillLabelNode.opacity = 255;
        this.skillLabelNode.getComponent(cc.Label).string = des;
        this.nameLabel.string = name;
    },


});
