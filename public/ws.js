"use strict"

Vue.component('food-item', {
  props: ['food'],
  template: '<li>{{ food.name }}</li>'
})

// Vue.component('grocery_list')
// {
// 	props:['full_grocery_list'],
// 	template:,
// }

var app = new Vue({
  el: '#demo',
  data: {
    message: "hello world",
    count: 0,
    received: 0,
    ptype: "",
    room: "",
    ws: io(),
  },
  methods:{
    play: function(){
      this.count +=1
      //console.log(this.count)
      this.ws.emit('chat message', this.count);
    },
    listen: function(){
      console.log("listening")
      this.ws.on('chat message', (msg) =>{
        console.log(msg)
        this.received = msg
      });

      this.ws.on('ptype', (msg) =>{
        if(msg.criminal){
          this.ptype = msg.criminal_type + " criminal";
        }
        else{
          this.ptype = "police";
        }
      });

      this.ws.on('room', (msg) =>{
        this.room = msg;
      });
    },
  },
  created: function () {
      this.play();
      this.listen();
  },
})