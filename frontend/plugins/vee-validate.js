import Vue from "vue"
import { ValidationProvider, ValidationObserver, extend } from "vee-validate"
import {
  required,
  email,
  regex,
  confirmed,
  integer,
  min,
  max,
  min_value,
  max_value,
  numeric,
} from "vee-validate/dist/rules"

export default () => {
  Vue.component("validation-provider", ValidationProvider)
  Vue.component("validation-observer", ValidationObserver)

  extend("required", {
    ...required,
    message: "This field is required",
  })
  extend("email", {
    ...email,
    message: "This email is not valid format",
  })
  extend("regex", {
    ...regex,
    message: "This field is not valid",
  })
  extend("confirmed", {
    ...confirmed,
    message: "Password confirmation does not match",
  })
  extend("integer", {
    ...integer,
    message: "This field must be a number",
  })
  extend("min", {
    ...min,
    params: ["length"],
    message: "This field must have at least {length} characters",
  })
  extend("max", {
    ...max,
    params: ["length"],
    message: "This field must have at most {length} characters",
  })
  extend("min_value", {
    ...min_value,
    params: ["value"],
    message: "Minimum value is {value}",
  })
  extend("max_value", {
    ...max_value,
    params: ["value"],
    message: "Maximum value is {value}",
  })
  extend("numeric", {
    ...numeric,
    message: "This field must be numeric",
  })
  extend("timezone_difference", {
    validate: (value) => {
      const exp = new RegExp(/^[-+]?[0-9]{1,2}(\.5)?$/)
      return (
        parseFloat(value) >= -12 && parseFloat(value) <= 12 && exp.test(value)
      )
    },
    message:
      "Timezone difference should be between -12 and 12. (e.g. -4 or 7 or 5.5)",
  })
}
