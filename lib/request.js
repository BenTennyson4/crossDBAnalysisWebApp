request = {
    // The data fields and their initial values
    requestType: "Employee_Name",
    data: "None",

    // Getter and setter methods for the class fields
    setRequestType (requestType) {
        if (requestType == "Employee Name") {
            this.requestType = "Employee_Name"; 
        }
        else if (requestType == "Employee ID") {
            this.requestType = "Employee_Name";
        }
        else {
            return "Incorrect request type";
        }
    },

    getRequestType () {
        return this.requestType;
    },

    passData (data) {
        this.data = data;
    },

    getData () {
        return this.data;
    }
};