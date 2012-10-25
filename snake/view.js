YUI.add('snake', function(Y) {

    var Designer = Y.namespace('designer');
    var timeOut; //global timeout 
    Designer.Snake = Y.Base.create('snake', Y.Widget, [], {

        initializer: function() {


        },

        renderUI: function() {
            if(this.get('rendered')) {
                return;
            }
            this.renderSnake();
            this.renderFood();
            this.buildListener();
        },

        renderSnake: function() {
            var container = this.get('container');
            var snake = Y.Node.create('<span class="designer_snake" style="top:120px;left:40px;"></span><span class="designer_snake" style="top:120px;left:0;"></span>');
            container.append(snake);
        },

        renderBody: function() {
            var body = Y.Node.create('<span class="designer_snake"></span>');
            return body;
        },

        renderFood: function() {
            var container = this.get('container');
            var food = Y.Node.create('<p class="designer_food"></p>');
            var snake = container.all('span');
            var top = snake.getStyle('top');
            var left = snake.getStyle('left');

            do {
                var x = this.createX();
                var y = this.createY();
            } while (this.checkPosition(x, y,0));

            food.setStyles({
                top: y,
                left: x
            })
            Y.one('body').append(food);
        },

        buildListener: function() {
            clearTimeout(timeOut);
            Y.one('body').on('keyup', function(e) {
                if(Math.abs(this.get('keyCode') - e.keyCode) == 2){
                    return;
                }else{
                    this.set('keyCode',e.keyCode);
                    var code = e.keyCode.toString();
                    switch(code) {
                    case '38':
                        this.set('x', 0);
                        this.set('y', -40);
                        this.move();
                        break;
                    case '39':
                        this.set('x', 40);
                        this.set('y', 0);
                        this.move();
                        break;
                    case '40':
                        this.set('x', 0);
                        this.set('y', 40);
                        this.move();
                        break;
                    case '37':
                        this.set('x', -40);
                        this.set('y', 0);
                        this.move();
                        break;
                    }
                }
            }, this)

        },

        move: function() {
            clearTimeout(timeOut);
            var container = this.get('container');
            var snake = container.all('span');
            var food = Y.one('.designer_food');
            var speed = this.get('speed');
            var x = this.get('x');
            var y = this.get('y');
            
            if(!this.get('eating')){
                container.all('.designer_snake:last-child').remove();
            }

            var body = this.renderBody();
            var header = container.all('.designer_snake:first-child');
            var t = parseInt(header.getStyle('top')) + y;
            var l = parseInt(header.getStyle('left')) + x;
            body.setStyles({
                top: t,
                left: l
            });
            container.prepend(body);
            this.checkFringe(body);
            this.eatFood(body,food);
            
            if(this.checkPosition(l,t,1)){
                this.lose();
            };

            var instance = this;
            timeOut = setTimeout(function() {
                instance.move();
            }, 800);

        },
        checkFringe: function(body) {
            var top = parseInt(body.getStyle('top'));
            var left = parseInt(body.getStyle('left'));
            if(top < 0 || top > 360 || left < 0 || left > 760) {
                this.lose();
            }
        },
        eatFood: function(body,food) {
            var top = parseInt(body.getStyle('top'));
            var left = parseInt(body.getStyle('left'));

            var food_top =parseInt(food.getStyle('top'));
            var food_left =parseInt(food.getStyle('left'));
            if(top == food_top && left == food_left){
                this.set('eating',true);
                var count = this.get('count');
                count +=1;
                this.set('count',count);
                food.remove();
                this.renderFood();
            }else{
                this.set('eating',false);
            }
        },
        checkPosition: function(x, y, i) {
            var container = this.get('container');
            var snake = container.all('span');
            for(var i = i; i < snake.size(); i++) {
                if(parseInt(snake._nodes[i].offsetLeft) == x && parseInt(snake._nodes[i].offsetTop) == y) {
                    return true;
                }
            }

        },

        createX: function() {
            var x = Math.round(Math.random() * 19) * 40;
            return x;
        },

        createY: function() {
            var Y = Math.round(Math.random() * 9) * 40;
            return Y;
        },

        lose : function(){
            alert('You lose , your count is '+ this.get('count') +'!');
            window.location.reload();
        }
    }, {
        ATTRS: {
            container: null,
            speed: 200,
            x: {
                value: 0
            },
            y: {
                value: 0
            },
            eating : {
                value : false
            },
            timeOut: null,
            count : {
                value : 0
            },
            keyCode : {
                value : 0
            }

        }

    });
}, '1.0.0', {
    requires: ['base-build', 'widget', 'selector-css3']
});