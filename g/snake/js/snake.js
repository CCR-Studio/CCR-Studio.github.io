

function init(){
    var moveAble = false;
    var bord = $(".snake-div .snake-main");
    console.log(1);
    /*var dc = $(".snake-div");
    $(dc).css("left",(window.screen.width-300)/2);
    $(dc).css("top",(window.screen.height-340)/2);*/
    $(bord).on("mousedown",function(e){
        moveAble = true;
        var dx = e.pageX - $(this).offset().left;
        var dy= e.pageY - $(this).offset().top;
        $(bord).on("mouseup",function(){
            moveAble = false;
        });
        $(bord).on("mousemove",function(e){
            if(moveAble){
                $(".snake-div").css({
                    'left': e.pageX - dx,
                    'top': e.pageY - dy-40

                });
            }
        });

    });
    /*$(bord).on("mouseout",function(){
        moveAble = false;
    });*/

    for(var i=0;i<20;i++){
        for(var j=0;j<20;j++){
            var c = $("<div id='map_"+i+"_"+j+"' class='snake-node'></div>");
            $(bord).append(c);
        }
    }
    // $(dc).removeAttr("hidden");
};
var Snake = function(x,y,direction){
    //蛇的身体
    this.body=[];
    this.block=[];
    this.headerX = 10;
    this.headerY = 10;
    //蛇的长度(不包含头)
    this.len=4;
    //蛇运动的方向    1-左；2-下；3-右；4-上
    this.dir = 1;
    //速度-ms
    this.speed = 900;
    this.speedCallBack = undefined;
    this.ds = 0;
    this.timer=null;
    this.food=null;
    this.allowWall=true;
    this.over=false;
    this.init=function(hx,hy,dir){
        if(hx !=undefined){
            this.headerX = hx;
        }
        if(hy !=undefined){
            this.headerY = hy;
        }
        if(dir !=undefined){
            this.dir = dir;
        }
        for(var i=1;i<=this.len;i++){
            if(this.dir ==1){
                //$("#map_"+(this.headerX)+"_"+(this.headerY+i)).addClass("snake-body");
                this.body.push({x:this.headerX,y:this.headerY+i})
            }else if(this.dir ==2){
                //$("#map_"+(this.headerX-i)+"_"+(this.headerY)).addClass("snake-body");
                this.body.push({x:this.headerX-i,y:this.headerY})
            }else if(this.dir ==3){
                //$("#map_"+(this.headerX)+"_"+(this.headerY-i)).addClass("snake-body");
                this.body.push({x:this.headerX,y:this.headerY-i})
            }else if(this.dir ==4){
                //$("#map_"+(this.headerX+i)+"_"+(this.headerY)).addClass("snake-body");
                this.body.push({x:this.headerX+i,y:this.headerY})
            }
        }
        this.draw();
        this.food=new Food();
        this.food.makeFood(this);
    };
    this.runLeft=function(){
        if(this.dir !=3){
            this.dir=1;
        }
    };
    this.runRight=function(){
        if(this.dir !=1){
            this.dir=3;
        }
    };
    this.runUp=function(){
        if(this.dir !=2){
            this.dir=4;
        }
    };
    this.runDown=function(){
        if(this.dir !=4){
            this.dir=2;
        }
    };
    this.run=function(){
        if(this.timer == null && !this.over){
            var that = this;
            this.timer = setInterval(function(){
                that.doRun(that);
            },this.speed);
        }
    };
    this.pause=function(){
        if(this.timer != null){
            clearInterval(this.timer);
            this.timer=null;
        }
    };
    this.doRun=function(that){
        var header={x:this.headerX,y:this.headerY};
        var tmp = [];
        tmp.push(header);
        tmp.push(that.body[that.len-1]);
        for(var i=that.len-1;i>0;i--){
            that.body.splice(i,1,that.body[i-1]);
        }
        that.body.splice(0,1,header);
        if(that.dir==1){
            that.headerY--;
            if(that.headerY<0&& that.allowWall){
                that.headerY=19;
            }
        }else if(that.dir==2){
            that.headerX++;
            if(that.headerX>19&& that.allowWall){
                that.headerX=0;
            }
        }else if(that.dir==3){
            that.headerY++;
            if(that.headerY>19&& that.allowWall){
                that.headerY=0;
            }
        }else if(that.dir==4){
            that.headerX--;
            if(that.headerX<0&& that.allowWall){
                that.headerX=19;
            }
        }

        that.eatFood(that.body[that.len-1]);
        var r =that.draw(tmp);
        if(!r){
            that.pause();
            that.over=true;
            alert("你输了");

        }
    };
    this.addBlock=function(){
        var flag=true;
        var x;
        var y;
        while(flag){
            x = Math.ceil(Math.random()*19);
            y = Math.ceil(Math.random()*19);
            if(x != this.headerX || y!= this.headerY){
                if(x!= this.food.x || y!=this.food.y){
                    for(var i=this.body.length-1;i>=0;i--){
                        var node=this.body[i];
                        if(node.x==x&& node.y==y){
                            break;
                        }
                        if(i==0){
                            flag=false;
                        }
                    }
                    if(flag){
                        for(var j=0;j<this.block.length;j++){
                            var node=this.block[j];
                            if(x == node.x && y==node.y){
                                flag = false;
                            }
                        }
                    }
                }else{
                    flag=false;
                }

            }else{
                flag=false;
            }

        }
        console.log(x,y);
        $("#map_"+x+"_"+y).addClass("snake-block");
        this.block.push({x:x,y:y});
    };
    this.eatFood=function(node){
        if(this.headerX==this.food.x && this.headerY==this.food.y){
            this.len++;
            this.body.push({x:node.x,y:node.y});
            $("#map_"+this.food.x+"_"+this.food.y).removeClass("snake-food");
            this.food=new Food();
            this.food.makeFood(this);
            this.ds++;
            if(this.ds>=10){
                this.ds=0;
                if(this.speed>100){
                    this.speed-=100;
                    this.addBlock();
                }else if(this.speed>20){
                    this.speed-=10;
                }
                if($.isFunction(this.speedCallBack)){
                    this.speedCallBack();
                }
                this.pause();
                this.run();
            }
        }
    };
    this.allowReachWall=function(){
        this.allowWall=!this.allowWall;
        return this.allowWall;
    };
    this.speedUp=function(){
        if(this.speed>=200){
            this.speed-=100;
            this.pause();
            this.run();
        }
    };
    this.speedDown=function(){
        this.speed+=100;
        this.pause();
        this.run();
    };
    this.isRun=function(){
        return this.timer != null;
    };
    this.draw=function(tmp){
        if(!this.allowWall){
            if(this.headerX<0||this.headerX>19||this.headerY<0||this.headerY>19){
                return false;
            }
        }
        if(tmp != undefined){
            var header=tmp[0];
            var tail=tmp[1];
            $("#map_"+header.x+"_"+header.y).removeClass("snake-header").addClass("snake-body");
            $("#map_"+tail.x+"_"+tail.y).removeClass("snake-body");
        }
        //$("#map_"+header.x+"_"+header.y);

        var res=true;
        for(var i=0;i<this.body.length;i++){
            var node=this.body[i];
            if(this.headerX == node.x && this.headerY==node.y){
                res = false;
            }
            $("#map_"+node.x+"_"+node.y).addClass("snake-body");
            $("#map_"+node.x+"_"+node.y).removeClass("snake-header-1");
            $("#map_"+node.x+"_"+node.y).removeClass("snake-header-2");
            $("#map_"+node.x+"_"+node.y).removeClass("snake-header-3");
            $("#map_"+node.x+"_"+node.y).removeClass("snake-header-4");
        }
        for(var i=0;i<this.block.length;i++){
            var node=this.block[i];
            if(this.headerX == node.x && this.headerY==node.y){
                res = false;
            }
            $("#map_"+node.x+"_"+node.y).addClass("snake-body");
        }
        $("#map_"+(this.headerX)+"_"+(this.headerY)).addClass("snake-header");
        $("#map_"+(this.headerX)+"_"+(this.headerY)).removeClass("snake-header-1");
        $("#map_"+(this.headerX)+"_"+(this.headerY)).removeClass("snake-header-2");
        $("#map_"+(this.headerX)+"_"+(this.headerY)).removeClass("snake-header-3");
        $("#map_"+(this.headerX)+"_"+(this.headerY)).removeClass("snake-header-4");
        $("#map_"+(this.headerX)+"_"+(this.headerY)).addClass("snake-header-"+this.dir);
        return res;
    };

    this.init(x,y,direction);

    //console.log(this);

    return this;
};
var Food=function(){
    this.x=0;
    this.y=0;
    this.makeFood = function(snake){
        var body=snake.body;
        var flag=true;
        while(flag){
            this.x = Math.ceil(Math.random()*19);
            this.y = Math.ceil(Math.random()*19);
            if(this.x != snake.headerX || this.y!= snake.headerY){
                for(var i=body.length-1;i>=0;i--){
                    var node=body[i];
                    if(node.x==this.x&& node.y==this.y){
                        break;
                    }
                    if(i==0){
                        flag=false;
                    }
                }
            }else{
                flag=false;
            }

        }
        this.drawFood();
    };
    this.drawFood=function(){
        //console.log("#map_"+this.x+"_"+this.y);
        $("#map_"+this.x+"_"+this.y).addClass("snake-food");
    }
};
