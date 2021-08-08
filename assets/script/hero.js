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
        speed: 100,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.busy = false;
        this.node.on('shot', this.shot, this);
        this.node.on('use_skill', this.use_skill, this);
        this.node.on('move', this.move, this);
        this.annimationComponent = this.getComponent(cc.Animation);
    },

    start () {
        
    },

    shot: function(delta_x, delta_y, flag){
        if(this.busy){
            return false;
        }
        this.busy = true;
        this.node.stopAllActions();
        this.annimationComponent.stop();
        if(delta_x < 0){
            this.node.scaleX = -1;
        }else{
            this.node.scaleX = 1;
        }

        var yFlag = 0;
        if(Math.abs(delta_x)>=1.5*Math.abs(delta_y)){
            this.annimationComponent.play('hero_shot');
        }
        else if(delta_y>0){
            this.annimationComponent.play('hero_shot1');
            yFlag = 1;
        }
        else{
            this.annimationComponent.play('hero_shot2');
            yFlag = -1;
        }
        if(flag == 'w'){
            this.node.parent.emit('spawnNewBullet', delta_x, delta_y);
            return true;
        }
        this.node.parent.emit('spawnNewBullet', this.node.scaleX, yFlag);
        return true;
    },

    on_shot_finish: function(){
        this.busy = false
    },

    use_skill: function(s) {
        if(this.busy){
            return;
        }
        this.node.stopAllActions();
        this.annimationComponent.stop();
        this.annimationComponent.play('hero_lvup');
        this.node.parent.emit('skill_ready', s);
    },

    move: function(delta_x, delta_y){
        if(this.busy){
            return
        }
        if(delta_x < 0){
            this.node.scaleX = -1;
        }else{
            this.node.scaleX = 1;
        }
        //计算玩家移动的时间
        var moveTime = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2))/this.speed;
        //让玩家移动到点击位置
        var moveAction = cc.moveBy(moveTime, delta_x, delta_y);

        //进行移动
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(moveAction, cc.callFunc(this.on_move_finish, this)));

        this.annimationComponent.play('hero_move');
    },

    on_move_finish: function(){
        this.annimationComponent.stop();
        this.annimationComponent.play('hero_stand');
    },

    // update (dt) {},
});
