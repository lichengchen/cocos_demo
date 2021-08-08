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
        id : 1,
        speed : 10,
        max_hp : 1,
        hpBar: cc.Sprite,
        label: cc.Label,
        game: cc.Node,
        atk: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.showing = false;
        this.die = false;
        this.game = Global.global_game;
        this.node.on('setID', this.setID, this);
        this.annimationComponent = this.getComponent(cc.Animation);
        this.node.on('go_ahead', this.go_ahead, this);
        this.node.on('get_damage', this.get_damage, this);
        this.node.on('on_found',this.on_found, this);

        this.routeX = new Array(-50,  -120, 10 , 80 , 80, 140, 120);
        this.routeY = new Array(-200, -90 , -90, -30, 10, -40, 100);

        this.endX = 340;
        this.endY =0;
    },

    start () {
        this.alive = true;
        this.locked = false;
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    setID: function (id, flag = 0) {
        this.id = id;
        switch(this.id){
            case 0:{        //蝙蝠
                this.speed = 30;
                this.max_hp = 2;
                this.atk = 1;
                break;
            }
            case 1:{        //哥布林
                this.speed = 10;
                this.max_hp = 5;
                this.atk = 1;
                break;
            }
            case 2:{        //orger
                this.speed = 10;
                this.max_hp = 10;
                this.atk = 2;
                break;
            }
            case 3:{        //强盗
                this.speed = 15;
                this.max_hp = 5;
                this.atk = 1;
                break;
            }
            case 4:{        //兽人战士
                this.speed = 12;
                this.max_hp = 8;
                this.atk = 2;
                break;
            }
            case 5:{        //小兽人
                this.speed = 14;
                this.max_hp = 5;
                this.atk = 1;
                break;
            }
            case 6:{        //骷髅士兵
                this.speed = 18;
                this.max_hp = 3;
                this.atk = 1;
                break;
            }
            case 7:{        //骷髅将军
                this.speed = 18;
                this.max_hp = 15;
                this.atk = 2;
                break;
            }
            case 8:{        //黑武士
                this.speed = 16;
                this.max_hp = 10;
                this.atk = 3;
                break;
            }
            case 9:{        //牛头人
                this.speed = 12;
                this.max_hp = 30;
                this.atk = 10;
                break;
            }
            case 10:{       //树妖
                this.speed = 10;
                this.max_hp = 300;
                this.atk = 20;
                break;
            }
            case 11:{       //兽人酋长
                this.speed = 10;
                this.max_hp = 300;
                this.atk = 20;
                break;
            }
        }
        if(flag == 1){
            this.routeX = new Array(-208,  -213, -24 ,216 , 59, -85, -275);
            this.routeY = new Array(17, -27 , -50, -130, -54, -53, 83);
    
            this.endX = -340;
            this.endY =0;
        }
        else if(flag == 2){
            this.routeX = new Array(-235,  -117, 117 ,59, -85, -275);
            this.routeY = new Array(41, -48 , -76, -54, -53, 83);
    
            this.endX = -340;
            this.endY =0;
        }
        else if(flag == 3){
            this.routeX = new Array(147,  49, 297 , 108 , -65, -109, -85);
            this.routeY = new Array(4, 102 , 58, 70, 53, 3, 70);
    
            this.endX = 0;
            this.endY = 295;
        }
        else if(flag == 4){
            this.routeX = new Array(-147,  -49, -297 , -108 , 65, 109, 85);
            this.routeY = new Array(4, 102 , 58, 70, 53, 3, 70);
    
            this.endX = 0;
            this.endY = 295;
        }
        else if(flag == 5){
            this.routeX = new Array(-47, -204, 66 , 76 , 90);
            this.routeY = new Array(136, 167 , 54, -5, 41);
    
            this.endX = 0;
            this.endY = 295;
        }
        else if(flag == 6){
            this.routeX = new Array(47, 204, -66 , -76 , -90);
            this.routeY = new Array(136, 167 , 54, -5, 41);
    
            this.endX = 0;
            this.endY = 295;
        }

        this.hp = this.max_hp;
        this.nextMove = 0;
        this.on_move_finish();
    },

    move: function(delta_x, delta_y){
        if(delta_x < 0){
            this.node.scaleX = -1;
            this.hpBar.node.scaleX = -0.1;
        }else{
            this.node.scaleX = 1;
            this.hpBar.node.scaleX = 0.1;
        }
        var moveTime = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2))/this.speed;
        var moveAction = cc.moveBy(moveTime, delta_x, delta_y);
        //进行移动
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(moveAction, cc.callFunc(this.on_move_finish, this)));

        this.play_move();
    },

    on_move_finish: function(){
        var len = this.routeX.length;
        if(this.nextMove < len){
            this.nextX = this.node.x + this.routeX[this.nextMove];
            this.nextY = this.node.y + this.routeY[this.nextMove];
            this.move(this.routeX[this.nextMove], this.routeY[this.nextMove]);
        }
        else if(this.nextMove == len){
            if(this.endX!=0){
                this.endX = this.endX - this.node.x;
            }
            if(this.endY!=0){
                this.endY = this.endY - this.node.y
            }
            this.nextX = this.endX;
            this.nextY = this.endY;
            this.move(this.endX, this.endY);
        }
        else if(this.nextMove == len+1){
            this.game.emit('minus_life');
            this.node.destroy();
        }
        this.nextMove++;
    },

    play_move: function () {
        this.annimationComponent.stop();
        var str = 'enermy_'+this.id+'_move';
        this.annimationComponent.play(str);
        //this.getComponent(cc.BoxCollider).size = this.node.size;
    },

    play_attack: function () {
        this.annimationComponent.stop();
        var str = 'enermy_'+this.id+'_attack';
        this.annimationComponent.play(str);
    },

    play_die: function () {
        if(this.die){
            return;
        }
        this.die = true;
        this.alive = false;
        this.getComponent(cc.BoxCollider).enabled = false;
        this.node.stopAllActions();
        this.annimationComponent.stop();
        var str = 'enermy_'+this.id+'_die';
        this.annimationComponent.play(str);
        this.game.emit('add_point', this.max_hp);

        if(this.otherNode){
            this.otherNode.emit('go_ahead');
        }

        var disappearTime = 3;
        if(this.id == 8){
            disappearTime = 1;
        }
        this.scheduleOnce(this.disappear, disappearTime);
    },

     /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    
    onCollisionEnter: function (other, self) {
        var damage = 0;
        if(other.node.getComponent('bullet')){
            damage = other.node.getComponent('bullet').damage;
        }
        else if(other.node.getComponent('rocket')){
            damage = other.node.getComponent('rocket').damage;
        }
        else if(other.node.getComponent('lightning')){
            damage = other.node.getComponent('lightning').damage;
            console.log(damage);
        }
        this.hp -= damage;
        if(this.hp<=0){
            self.enabled = false;
            this.hp = 0;
            this.hpBar.fillRange = 0;
            this.play_die();
        }
        else{
            this.hpBar.fillRange = this.hp / this.max_hp;
        }
    },

    on_found: function(otherNode) {
        this.node.stopAllActions();
        this.locked = true;
        this.annimationComponent.stop();
        this.otherNode = otherNode;
        if(this.node.x > this.otherNode.x){
            this.node.scaleX = -1;
            this.hpBar.node.scaleX = -0.1;
        }
        else{
            this.node.scaleX = 1;
            this.hpBar.node.scaleX = 0.1;
        }
    },

    get_damage: function(d) {       //from alliance
        this.hp -= d;
        if(this.hp<=0){
            this.hp = 0;
            this.hpBar.fillRange = 0;
            this.play_die();
        }
        else{
            this.hpBar.fillRange = this.hp / this.max_hp;
            this.do_atk();
        }
    },

    do_atk: function() {
        if(this.node.x > this.otherNode.x){
            this.node.scaleX = -1;
        }
        else{
            this.node.scaleX = 1;
        }
        this.play_attack();
    },

    on_atk_finish: function() {
        if(this.otherNode && !this.otherNode.die){
            this.otherNode.emit('get_damage', this.atk);
        }
        else{
            this.go_head();
        }
    },

    go_ahead: function() {
        this.play_move();
        this.locked = false;
        this.move(this.nextX - this.node.x, this.nextY - this.node.y);
    },

    disappear: function() {
        if(this.id == 10 || this.id == 11){
            this.game.emit('victory');
        }
        this.node.destroy();
    },
});
