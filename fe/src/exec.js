var slugify = function(name) {
    console.log(typeof name);
    return name.split(' ').join('-').toLowerCase();
};

var ModuleExample = React.createClass({
    render: function() {
        var self = this;
        return (
            <div className="panel panel-default">
                <div className="panel-heading">{this.props.name}</div>
                <div className="panel-body"
                     onClick={
                        function() {
                            self.props.selectModule(self.props.id);
                        }}>
                    <p>{this.props.description}</p>
                </div>
            </div>
        );
    }
});

var Module = React.createClass({
    runModule: function() {
        var inputs = [];
        for (var i = 0; i < this.props.inputs.length; ++i) {
            var el = $('#select' + slugify(this.props.inputs[i].name) + ' option:selected').text();
            inputs.push(el);
        }
        let output = this.props.runIt(inputs);
        this.props.addNewAction(this.props.id, inputs, output.value, output.type);
    },
    render: function() {
        var self = this;
        var renderInputs = this.props.inputs.map(function(input) {
            var options = self.props.memory.filter(function(memoryItem) {
                return memoryItem.type == input.type;
            }).map(function(memoryItem) {
                return <option key={slugify(memoryItem.name)}>{memoryItem.name}</option>;
            });
            return (
                <li className="list-group-item">
                    <label htmlFor={"select" + slugify(input.name)}>
                        {input.name}
                    </label>
                    <select className="form-control" id={"select" + slugify(input.name)}>
                        {options}
                    </select>
                </li>
            );
        });
        var renderButton = <renderButton className="btn btn-info"
                                         onClick={this.runModule}>Run</renderButton>;
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">{this.props.name}</div>
                <div className="panel-body">
                    <div className="row">
                        <div className="col-md-12">
                            {this.props.description}
                        </div>
                        <div className="col-md-12">
                            {renderInputs}
                        </div>
                        <div className="col-md-12">
                            {renderButton}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var ActionTable = React.createClass({
    arrayToText: function(arr) {
        if (!arr) {
            return "";
        }
        return arr.join(", ");
    },
    render: function() {
        var count = 0;
        var self = this;

        var rows = this.props.actions.map(function(action) {
            count++;
            return (
                <tr key={"row" + count}>
                    <td>
                        {count}
                    </td>
                    <td>
                        {action.moduleName}
                    </td>
                    <td>
                        {self.arrayToText(action.inputs)}
                    </td>
                    <td>
                        {action.output}
                    </td>
                </tr>
            );
        });
        return (
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Module</th>
                    <th>Inputs</th>
                    <th>Outputs</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                <tr key={"row" + count}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <button className="btn btn-default" onClick={this.props.removeLast}>
                            Remove last action
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }
});

var Modules = React.createClass({
    getInitialState: function () {
        return {
            selectedModule: -1
        };
    },
    selectModule: function (idx) {
        this.setState({
            selectedModule: idx
        });
    },
    render: function () {
        var self = this;
        var renderModules = this.props.modules.map(function (module) {
            var renderModule;
            if (self.state.selectedModule === module.id) {
                renderModule = <Module key={slugify(module.name)}
                                       name={module.name}
                                       id={module.id}
                                       description={module.description}
                                       memory={self.props.memory}
                                       inputs={module.inputs}
                                       addNewAction={self.props.addNewAction}
                                       runIt={module.runIt}
                                       selectModule={self.selectModule} />
            } else {
                renderModule = <ModuleExample key={slugify(module.name)}
                                              name={module.name}
                                              id={module.id}
                                              description={module.description}
                                              selectModule={self.selectModule} />
            }
            return (
                <div className="col-md-12">
                    {renderModule}
                </div>
            );
        });
        return (
            <div className="row">
                {renderModules}
            </div>
        );
    }
});

var Memory = React.createClass({
    render: function() {
        var self = this;
        var rows = this.props.memory.map(function(row) {
            var classOfRow = "info";
            if (row.name == self.props.result) {
                classOfRow = "success";
            }
            return (
                <tr key={slugify(row.name)} className={classOfRow}>
                    <td className="lead text-center">
                        {row.name}
                    </td>
                    <td className="text-center">
                        {row.type}
                    </td>
                </tr>
            );
        });
        return (
            <table className="table table-bordered">
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
});

var MainView = React.createClass({
    getInitialState: function() {
        return {
            input: "",
            output: "",
            memory: [],
            actions: [],
            modules: this.prepareModules()
        }
    },
    prepareModules: function() {
        return [
            {
                id: 0,
                name: "Str To Int",
                description: "Converts string to integer",
                runIt: function(a) {
                    return {
                        value: parseInt(a[0]),
                        type: "int"
                    };
                },
                inputs: [
                    {
                        name: 'String to convert',
                        type: 'string'
                    }
                ]
            },
            {
                id: 1,
                name: "Add two integers",
                description: "Given two integers, returns their sum",
                runIt: function(a) {
                    return {
                        value: parseInt(a[0]) + parseInt(a[1]),
                        type: "int"
                    };
                },
                inputs: [
                    {
                        name: 'First integer',
                        type: 'int'
                    },
                    {
                        name: 'Second integer',
                        type: 'int'
                    }
                ]
            },
            {
                id: 2,
                name: "Subtract two integers",
                description: "Given two integers, returns their subtraction",
                runIt: function(a) {
                    return {
                        value: parseInt(a[0]) - parseInt(a[1]),
                        type: "int"
                    };
                },
                inputs: [
                    {
                        name: 'First integer',
                        type: 'int'
                    },
                    {
                        name: 'Second integer',
                        type: 'int'
                    }
                ]
            },
            {
                id: 3,
                name: "Give birthday",
                description: "Returns birthday of the given person",
                runIt: function(a) {
                    var name = a[0];
                    if (name == 'pushkin') {
                        return {
                            value: 1799,
                            type: "int"
                        };
                    }
                    if (name == 'esenin') {
                        return {
                            value: 1799 + 96,
                            type: "int"
                        };
                    }
                    return {
                        value: 1988,
                        type: "int"
                    };
                },
                inputs: [
                    {
                        name: 'Last name of the person',
                        type: 'string'
                    }
                ]
            }
        ];
    },
    prepareMemory: function(input) {
        return input.split(' ').map(function(token) {
            return {
                'name': token.toLowerCase(),
                'type': 'string'
            };
        });
    },
    loadDataFromServer: function() {
        $.ajax({
            type: 'GET',
            url: '/get_io_example',
            success: function (data) {
                this.setState({
                    input: data.input,
                    output: data.output,
                    memory: this.prepareMemory(data.input),
                    actions: []
                });
            }.bind(this),
            error: function(data) {
                this.setState({
                    input: "Difference in age of Pushkin and Esenin",
                    output: "96",
                    memory: this.prepareMemory("Difference in age of Pushkin and Esenin"),
                    actions: []
                });
            }.bind(this)
        })
    },
    componentWillMount: function() {
        this.loadDataFromServer();
    },
    removeLastAction: function() {
        if (this.state.actions.length) {
            this.state.actions.pop();
            this.state.memory.pop();
            this.forceUpdate();
        }
    },
    simpleValidate: function() {
        return true;
    },
    sendDataToServer: function() {
        if (this.simpleValidate()) {
            $.ajax({
                type: 'POST',
                url: '/send_data',
                data: {
                    actions: this.state.actions,
                    memory: this.state.memory
                },
                success: function() {
                    this.loadDataFromServer();
                }.bind(this)
            })
        }
    },
    addNewAction: function(withModule, inputs, output, outputType) {
        this.state.actions.push({
            inputs: inputs,
            output: output,
            moduleName: withModule
        });
        this.state.memory.push({
            type: outputType,
            name: "" + output
        });
        this.forceUpdate();
    },
    render: function() {
        return (
            <div className="row">
                <div className="col-md-12 text-center">
                    <h1>{this.state.input}</h1>
                    <h2>{this.state.output}</h2>
                </div>
                <div className="col-md-1 text-center">
                </div>
                <div className="col-md-2 text-center">
                    <Memory memory={this.state.memory} result={this.state.output} />
                </div>
                <div className="col-md-8 text-center">
                    <div className="col-md-12 text-center">
                        <ActionTable actions={this.state.actions} removeLast={this.removeLastAction} />
                    </div>
                    <div className="col-md-12 text-center">
                        <Modules memory={this.state.memory}
                                 modules={this.state.modules}
                                 addNewAction={this.addNewAction} />
                    </div>
                </div>
                <div className="col-md-10 text-right">
                    <button className="btn btn-primary btn-lg" onClick={this.sendDataToServer}>
                        Finish
                    </button>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <MainView />,
    document.getElementById('app')
);