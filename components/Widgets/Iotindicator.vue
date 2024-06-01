<template>
  <!-- Shows the status of a LED, pump, or any ON/OFF device -->
  <card>
    <div slot="header">
      <h4 class="card-title">
        <!-- double braves to print variable value {{  }} -->
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h4>
    </div>

    <!-- class with braces {} for variable-linked classes. Class with sq brackets for array containing class from variable and method -->
    <i class="fa " :class="[config.icon, getIconColorClass()]" style="font-size: 30px" ></i>
    <!-- as intended, user will pass incomplete class name in UX. getIconColorClass() gives the full name of the class to name the icon.
    When value is false,returns text-dark, else for on, returns complete name e.g. text-success or text-primary or whatever applies  -->
  </card>
</template>

<script>
export default {
  props: ['config'],
  data() {
    return {
      //notice we are passing all the device config in props config. Value here controls whether the icons is on or off
      value: false

    };
  },
  mounted(){
      //userId/dId/uniquestr/sdata   topic-subscription structure style
    const topic = this.config.userId + "/" + this.config.selectedDevice.dId + "/" + this.config.variable + "/sdata";
    console.log(topic);
    this.$nuxt.$on(topic, this.processReceivedData);  //listener on new messages for 'topic', execute processReceivedData (no parenthesis)
  },
  beforeDestroy(){
    //this is really important. Avoids undesired reactivity from 
    this.$nuxt.$off(this.config.userId + "/" + this.config.selectedDevice.dId + "/" + this.config.variable + "/sdata")
  },
  methods: {

    processReceivedData(data){
      //data received on new 'topic' message 
        console.log("received");
        console.log(data);
        this.value = data.value;  //makes device.value equal to value being received from other view (e.g. templates) 
    },
      
    getIconColorClass() {
      if (!this.value) {  //if value== false (off)
        return "text-dark";
      }
      // if value == true, return a class color, depending on the device class
      if (this.config.class == "success") {
        return "text-success";
      }
      if (this.config.class == "primary") {
        return "text-primary";
      }
      if (this.config.class == "warning") {
        return "text-warning";
      }
      if (this.config.class == "danger") {
        return "text-danger";
      }
    }

  }
};


</script>
