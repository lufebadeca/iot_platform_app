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
              label="Device Name"
              type="text"
              placeholder="Ex: Home, Office..."
            >
            </base-input>
          </div>

          <div class="col-4">
            <base-input
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
              value="1"
              placeholder="Select Template"
              class="select-primary"
              style="width:100%"
            >
              <el-option
                class="text-dark"
                value="Template 1"
                label="Template 1"
              ></el-option>

              <el-option
                class="text-dark"
                value="Template 2"
                label="Template 2"
              ></el-option>

              <el-option
                class="text-dark"
                value="Template 3"
                label="Template 3"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="row pull-right">
          <div class="col-12">
            <base-button type="info" class="mb-3" size="lg">Add</base-button>
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

    <Json :value="$store.state.devices"></Json>
    
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
    };
  },
  mounted() {
    this.$store.dispatch("getDevices")
  },
  methods: {
    deleteDevice(device) {

      const axiosHeader = {
        headers: {
          token: this.$store.state.auth.token  //access the global state token
        },
        params: {
          dId: device.dId
        }
      }
      alert("Deleting " + device.name);
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
