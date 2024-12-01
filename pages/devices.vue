<template>
  <div>
    <!-- FORM ADD DEVICE -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Add new Device</h4>
        </div>

        <div class="row">
          <div class="col-4">
            <base-input
              v-model="newDevice.name"
              label="Device Name"
              type="text"
              placeholder="Ex: Home, Office..."
            >
            </base-input>
          </div>

          <div class="col-4">
            <base-input
              v-model="newDevice.dId"
              label="Device Id"
              type="text"
              placeholder="Ex: 7777-8888"
            >
            </base-input>
          </div>

          <div class="col-4">
            <slot name="label">
              <label> Template </label>
            </slot>

            <el-select
              v-model="templateIndex"
              placeholder="Select Template"
              class="select-primary"
              style="width:100%"
            >
              <el-option
                v-for="(template, index) in templates"
                class="text-dark"
                :value="index"
                :label="template.name"
                :key="template._id"
              ></el-option>

            </el-select>
          </div>
        </div>

        <div class="row pull-right">
          <div class="col-12">
            <base-button type="info" class="mb-3" size="lg" @click="createNewDevice()">Add</base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- DEVICES TABLE -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Devices</h4>
        </div>

        <el-table :data="$store.state.devices"> <!--Each iteration represents an element of the data array (devices here) -->
          <!-- needs Table and Table.Column. Passing the objects array 'devices' from export default below /now global state -->

          <el-table-column label="#" min-width="50" align="center">
            <!-- slot-scope to extract information of the current iteration (table-column is automated) -->

            <div slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </div>
          </el-table-column>

          <!-- prop is the source data for the column. Cells will automatically fill for rows  -->
          <el-table-column prop="name" label="Name"></el-table-column>

          <el-table-column prop="dId" label="Device Id"></el-table-column>

          <el-table-column
            prop="templateName"
            label="Template"
          ></el-table-column>

          <el-table-column label="Actions">
            <div slot-scope="{ row, $index }">
              <!-- slot-scope to extract information of the current iteration (table-column is automated) -->

              <!-- compact container to host buttons, icons and similar within table cells. Content is shown when hovering -->
              <el-tooltip content="Saver Status Indicator" style="margin-right:10px">

                <!-- icon object for database. Fix class database, variable classes: text-success when saverRule = true and text-dark when false  -->
                <i class="fas fa-database " :class="{'text-success' : row.saverRule, 'text-dark' : !row.saverRule}" ></i>
              </el-tooltip>
              
              <!-- switch for each row. Uses index to send iteration number as parameter for updating the right DB status -->
              <el-tooltip content="Database Saver">
                <base-switch @click="updateSaverRuleStatus($index)" :value="row.saverRule" type="primary" on-text="On" off-text="Off">
                </base-switch>
              </el-tooltip>
              
              <!-- tooltip for delete button -->
              <el-tooltip content="Delete" @click="deleteDevice(row)" effect="light" :open-delay="300" placement="top">
                <!-- tooltip for delete button -->
                <base-button type="primary" icon size="sm" class="btn-link" @click="deleteDevice(row)">
                  <i class="tim-icons icon-simple-remove "></i>
                </base-button>
              </el-tooltip>

            </div>
          </el-table-column>
        </el-table>
      </card>
    </div>

    <Json :value="templates"></Json>
    
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

export default {
  middleware: "authenticated",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      templates: [],
      templateIndex: null,
      newDevice: {
        name: "",
        dId: "",
        templateId: "",
        templateName: ""
      }
    };
  },
  mounted() {
    this.$store.dispatch("getDevices");
    this.getTemplates();
  },
  methods: {

    //Get Devices
    async getDevices() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      try {
        const res = await this.$axios.get("/device", axiosHeaders);
        console.log(res.data);
        if (res.data.status == "success") {
          this.templates = res.data.data;   //updates the local prop devices, brings the _id given by mongo db
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting templates..."
        });
        console.log(error);
        return;
      }
    },

    //new device
    createNewDevice() {
      if (this.newDevice.name == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Device Name is Empty :("
        });
        return;
      }
      if (this.newDevice.dId == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Device ID is Empty :("
        });
        return;
      }
      if (this.templateIndex == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Template must be selected"
        });
        return;
      }
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      //writing name and id of newDevice
      this.newDevice.templateId = this.templates[ this.templateIndex ]._id;
      this.newDevice.templateName = this.templates[ this.templateIndex ].name;
      const toSend = {
        newDevice: this.newDevice
      };
      this.$axios
        .post("/device", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: `Success! Device ${this.newDevice.name} was added`
            });
            this.$store.dispatch("getDevices");
            this.newDevice.name = "";
            this.newDevice.dId = "";
            this.templateIndex = null;
            return;
          }
        })
        .catch(e => {
          if (
            e.response.data.status == "error" &&
            e.response.data.error.errors.dId.kind == "unique"
          ) {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message:
                "The device is already registered in the system. Try another device"
            });
            return;
          } else {
            this.showNotify("danger", "Error");
            return;
          }
        });
    },

    //Get Templates
    async getTemplates() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      try {
        const res = await this.$axios.get("/template", axiosHeaders);
        console.log(res.data);
        if (res.data.status == "success") {
          this.templates = res.data.data;
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting templates..."
        });
        console.log(error);
        return;
      }
    },

    deleteDevice(device) {

      const axiosHeader = {   //a header is necessary to build the axios request
        headers: {
          token: this.$store.state.auth.token  //access the global state and retrieves token
        },
        params: {
          dId: device.dId
        }
      }
      //alert("Deleting " + device.name);
      this.$axios  //axios is globally accessible by nuxt. middleman between front and API to make requests
        .delete("/device", axiosHeader) //the delete method receives params via URL (query), they go in the header
        .then(res => {
          //success! - device deleted.
          if (res.data.status == "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Device " + device.name + " deleted!"
            });
            this.$store.dispatch("getDevices");  //fetch new device list from DB and updates the global state
          }
        })
        .catch( (err)=>{
          console.log(err);
          this.$notify({
              type: "danger",
              icon: "tim-icons icon-alert-circle-exc",
              message: "Device " + device.name + " deleted!"
            });
        } )
    },     
    updateSaverRuleStatus(index) {
      console.log(index);
      this.devices[index].saverRule = !this.devices[index].saverRule;
    }
  }
};
</script>
