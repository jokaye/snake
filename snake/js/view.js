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
            this.renderScoreMarker();
        },

        renderScoreMarker: function() {
            var maker = document.querySelector('.score_marker');
            od = new Odometer({
                  el: maker,
                  value: 0,
                  format: '',
                  theme: 'digital'
                });
            this.set('maker', od);

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
            var container = this.get('container'),
                food = Y.Node.create('<p class="designer_food"></p>'),
                snake = container.all('span'),
                top = snake.getStyle('top'),
                left = snake.getStyle('left'),
                x,
                y;

            do {
                x = this.createX();
                y = this.createY();
            } while (this.checkPosition(x, y,0));

            food.setStyles({
                top: y,
                left: x
            });
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
            }, this);

        },

        move: function() {
            clearTimeout(timeOut);
            var container = this.get('container'),
                snake = container.all('span'),
                food = Y.one('.designer_food'),
                speed = this.get('speed'),
                x = this.get('x'),
                y = this.get('y');
            
            if(!this.get('eating')){
                container.all('.designer_snake:last-child').remove();
            }

            var body = this.renderBody();
            var header = container.all('.designer_snake:first-child');
            var t = parseInt(header.getStyle('top'), 10) + y;
            var l = parseInt(header.getStyle('left'), 10) + x;
            body.setStyles({
                top: t,
                left: l
            });
            container.prepend(body);
            this.eatFood(body,food);
            
            if(this.checkPosition(l,t,1) || this.checkFringe(body)){
                this.lose();
            }else{

                var instance = this;

                timeOut = setTimeout(function() {
                    instance.move();
                }, speed);
                this.get('timeOut').push(timeOut);
            }
        },

        stop: function() {
            Y.Array.each(this.get('timeOut'), function(t){
                clearTimeout(t);
            })
        },

        checkFringe: function(body) {
            var top = parseInt(body.getStyle('top'), 10);
            var left = parseInt(body.getStyle('left'), 10);
            if(top < 0 || top > 360 || left < 0 || left > 760) {
                return true;
            }
            return false;
        },

        eatFood: function(body,food) {
            var top = parseInt(body.getStyle('top'), 10);
                left = parseInt(body.getStyle('left'), 10),
                food_top =parseInt(food.getStyle('top'), 10),
                food_left =parseInt(food.getStyle('left'), 10),
                maker = this.get('maker');

            if(top == food_top && left == food_left){
                this.set('eating',true);
                var count = this.get('count');
                count +=1;
                this.set('count',count);
                food.remove();
                maker.update(count);
                this.renderFood();
            }else{
                this.set('eating',false);
            }
        },


        checkPosition: function(x, y, i) {
            var container = this.get('container');
            var snake = container.all('span');
            for(var i = i; i < snake.size(); i++) {
                if(parseInt(snake._nodes[i].offsetLeft, 10) == x && parseInt(snake._nodes[i].offsetTop, 10) == y) {
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
            this.stop();
            this.destroy();
            alert('You lose , your count is '+ this.get('count') +'!');
            window.location.reload();
        }
    }, {
        ATTRS: {
            container: null,
            maker: null,
            speed: {
                value: 240
            },
            x: {
                value: 0
            },
            y: {
                value: 0
            },
            eating : {
                value : false
            },
            timeOut: {
                value : []
            },
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