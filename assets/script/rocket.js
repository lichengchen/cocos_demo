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
        speed : 100,
        damage : 5,
    },

    // LIFE-CYCLE CALLBACKS:

    move: function(aim_x, aim_y){
        let comVec = cc.v2(1, 0);    // 水平向右的对比向量
        let radian = cc.v2(aim_x, aim_y).signAngle(comVec);    // 求方向向量与对比向量间的弧度
        let degree = cc.misc.radiansToDegrees(radian);    // 将弧度转换为角度
        this.node.rotation = degree;

        var l = Math.sqrt(Math.pow(aim_x, 2)+Math.pow(aim_y, 2));
        this.delta_x = this.speed * aim_x / l;
        this.delta_y = this.speed * aim_y / l;
        this.annimationComponent.play('rocket_move');
        this.moving = true;
    },

    onLoad () {
        this.moving = false;
        this.annimationComponent = this.getComponent(cc.Animation);
        this.node.on('move', this.move, this);
    },

    start() {
        cc.director.getCollisionManager().enabled = true;
    },

    update (dt){
        if(this.moving){
            this.node.x += this.delta_x*dt;
            this.node.y += this.delta_y*dt;
            let W = 700;
            let H = 600;
            var boom = false;
            if(this.node.x<-W/2||this.node.x>W/2||this.node.y<-H/2||this.node.y>H/2){
                this.moving = false;
                boom = true
            }
            if(boom){
                this.annimationComponent.stop();
                this.annimationComponent.play('rocket_boom');
                this.getComponent(cc.AudioSource).play();
            }
        }
    },

    on_boom_finish: function(){
        this.node.destroy();
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        self.enabled = false;
        this.moving = false;
        this.annimationComponent.stop();
        this.annimationComponent.play('rocket_boom');
        this.getComponent(cc.AudioSource).play();
    },

});
