<template>
  <card>
    <div slot="header">
      <h4 class="card-title">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h4>
    </div>

    <i
      class="fa "
      :class="[config.icon, getIconColorClass()]"
      style="font-size: 30px"
    ></i>

    <base-button  @click="sendValue()" :type="config.class" class="mb-3 pull-right" size="lg">Add</base-button>

  </card>
</template>

<script>
export default {
  props: ["config"],
  data() {
    return {
      sending: false,
    };
  },
  mounted() {
 
  },
  methods: {

    sendValue() {
        this.sending = true;
        setTimeout(() => {
            this.sending = false;
        }, 500);

        const toSend = {
            topic: this.config.userId + "/" + this.config.selectedDevice.dId + "/" + this.config.variable + "/actdata", //actdata for setting apart outgoing data
            msg: {
                value: this.config.message
            }
        };

        console.log(toSend);
        this.$nuxt.$emit('mqtt-sender', toSend);
    },
   

    getIconColorClass() {

      if (!this.sending) {    //sending is for now a setTimeOut to simulate a sending process. If sending, it will have color, else, dark
        return "text-dark";
      }

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
      if (this.config.class == "info") {
        return "text-info";
      }
    }
  }
};
</script>
