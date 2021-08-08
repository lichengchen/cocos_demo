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
        //id: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_ENTER,this.on_mouse_enter,this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,this.on_mouse_leave,this);

        this.infoNode = Global.infoNode;
        this.skillNode = Global.skillNode;

        this.enermyInfoNode = this.infoNode.getChildByName('enermyInfoNode');
        this.skillLabelNode = this.infoNode.getChildByName('label_skill');
        this.nameLabel = this.infoNode.getChildByName('label_name').getComponent(cc.Label);
        this.headSprite = this.infoNode.getChildByName('image_head').getComponent(cc.Sprite);

        this.enermyComponent = this.getComponent('enermy');
        this.skillComponent = this.getComponent('skill');
        this.allianceComponent = this.getComponent('alliance');
    },

    start () {
        this.showing = false;
    },

    on_mouse_enter: function() {
        this.showing = true;
        if(this.enermyComponent){
            this.show_enermy_info();
        }
        else if(this.allianceComponent){
            this.show_alli_info();
        }
        
    },

    show_alli_info: function() {
        var s1 = '';
        var s2 = '';
        var hp = this.allianceComponent.hp;
        var max_hp = this.allianceComponent.max_hp;
        var atk = this.allianceComponent.atk;
        var speed = this.allianceComponent.speed;
        var image_name = '';
        switch(this.allianceComponent.id){
            case 0:
                s1 = '盟友--近卫军';
                s2 = '装备精良的战士';
                image_name = 'image 9912';
                break;
            case 1:
                s1 = '盟友--狂战士';
                s2 = '手持双斧的神秘伐木人';
                image_name = 'image 9870';
                break;
            case 2:
                s1 = '盟友--不死骑士';
                s2 = '濒死时释放闪电造成大量范围伤害，并传送回城堡';
                image_name = 'image 9868';
                break;
        }

        var self = this;
        cc.loader.loadRes("others", cc.SpriteAtlas, function (err, atlas) {
            var frame = atlas.getSpriteFrame(image_name);
            self.headSprite.spriteFrame = frame;
        });

        this.enermyInfoNode.opacity = 255;
        this.skillLabelNode.opacity = 0;

        this.nameLabel.string = s1;
        this.enermyInfoNode.getChildByName('label_des').getComponent(cc.Label).string = s2;
        this.enermyInfoNode.getChildByName('label_hp').getComponent(cc.Label).string = hp + '/' + max_hp;
        this.enermyInfoNode.getChildByName('label_atk').getComponent(cc.Label).string = atk;
        this.enermyInfoNode.getChildByName('label_speed').getComponent(cc.Label).string = speed;
    },

    show_enermy_info: function() {
        var s1 = '';
        var s2 = '';
        var hp = this.enermyComponent.hp;
        var max_hp = this.enermyComponent.max_hp;
        var atk = this.enermyComponent.atk;
        var speed = this.enermyComponent.speed;
        var image_name = '';

        switch(this.enermyComponent.id){
            case 0:
                s1 = '大蝙蝠';
                s2 = '在空中快速飞行,不会被战士们拦截';
                image_name = 'image 9880';
                break;
            case 1:
                s1 = '哥布林';
                s2 = '';
                image_name = 'image 9872';
                break;
            case 2:
                s1 = '食人魔';
                s2 = '使用巨大木棒作为武器';
                image_name = 'image 9882';
                break;
            case 3:
                s1 = '强盗';
                s2 = '';
                image_name = 'image 9896';
                break;
            case 4:
                s1 = '兽人战士';
                s2 = '';
                image_name = 'image 9984';
                break;
            case 5:
                s1 = '小兽人';
                s2 = '';
                image_name = 'image 9918';
                break;
            case 6:
                s1 ='骷髅士兵';
                s2 = '';
                image_name = 'image 9964';
                break;
            case 7:
                s1 = '骷髅将军';
                s2 = '';
                image_name = 'image 9966';
                break;
            case 8:
                s1 = '黑武士';
                s2 = '使用威力强大的光剑';
                image_name = 'image 10034';
                break;
            case 9:
                s1 = '牛头人';
                s2 = '哞！哞！';
                image_name = 'image 9928';
                break;
            case 10:
                s1 = '树妖王';
                s2 = '邪恶丛林的王者';
                image_name = 'image 9998';
                break;
            case 11:
                s1 = '兽人酋长';
                s2 = '骑着巨型野猪的长者';
                image_name = 'image 9986';
                break;
        }

        var self = this;
        cc.loader.loadRes("others", cc.SpriteAtlas, function (err, atlas) {
            var frame = atlas.getSpriteFrame(image_name);
            if(self.headSprite){
                self.headSprite.spriteFrame = frame;
            }
        });

        this.enermyInfoNode.opacity = 255;
        this.skillLabelNode.opacity = 0;

        this.nameLabel.string = s1;
        this.enermyInfoNode.getChildByName('label_des').getComponent(cc.Label).string = s2;
        this.enermyInfoNode.getChildByName('label_hp').getComponent(cc.Label).string = hp + '/' + max_hp;
        this.enermyInfoNode.getChildByName('label_atk').getComponent(cc.Label).string = atk;
        this.enermyInfoNode.getChildByName('label_speed').getComponent(cc.Label).string = speed;
        
    },

    on_mouse_leave: function() {
        var self = this;
        cc.loader.loadRes("others", cc.SpriteAtlas, function (err, atlas) {
            var frame = atlas.getSpriteFrame('image 9866');
            self.headSprite.spriteFrame = frame;
        });

        this.enermyInfoNode.opacity = 0;
        this.skillLabelNode.opacity = 255;
        this.skillLabelNode.getComponent(cc.Label).string = '移动鼠标到单位/技能上来查看说明';
        this.nameLabel.string = '提示';
        this.showing = false;
    },

    update(dt){
        if(this.showing){
            this.reshow_hp();
        }
    },

    reshow_hp: function() {
        if(this.node){
            var hp =0;
            var max_hp =0;
            if(this.enermyComponent){
                hp = this.enermyComponent.hp;
                max_hp = this.enermyComponent.max_hp;
            }
            else if(this.allianceComponent){
                hp = this.allianceComponent.hp;
                max_hp = this.allianceComponent.max_hp;
            }
            this.enermyInfoNode.getChildByName('label_hp').getComponent(cc.Label).string = hp + '/' + max_hp;
        }
    }

});
