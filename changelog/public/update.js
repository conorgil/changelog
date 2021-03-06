// Dependencies
var fs = require("fs");
var editor = require("editor");

module.exports = function(type) {

    // Make sure changelog file exists
    fs.readFile("CHANGELOG.md", "utf8", function(err, contents) {

        if (err) {
            changelog.display(null, "fileNotFound");
        } else {

            // Parse the changelog
            changelog.parse(contents, function(err, output) {

                if (err) {
                    changelog.display(null, "parseError");
                } else {

                    // Different words, phrases and text sections
                    var header = "";
                    var verb = "";
                    var past = "";

                    // Get the correct section header based on type
                    switch (type) {
                        case "add":
                            header = "Added";
                            verb = "added";
                            past = "additions";
                            break;
                        case "change":
                            header = "Changed";
                            verb = "changed";
                            past = "changes";
                            break;
                        case "deprecate":
                            header = "Deprecated";
                            verb = "deprecated";
                            past = "deprecations";
                            break;
                        case "remove":
                            header = "Removed";
                            verb = "removed";
                            past = "removals";
                            break;
                        case "fix":
                            header = "Fixed";
                            verb = "fixed";
                            past = "fixes";
                            break;
                        case "secure":
                            header = "Security";
                            verb = "secured";
                            past = "secures";
                            break;
                    }

                    // Add unreleased header if one is not already present
                    var newHeader = ""; // To show an additional message after creation
                    if (!output.length) {
                        output.unshift({
                            version: "Unreleased",
                            released: false,
                            date: null,
                            link: null,
                            content: {}
                        });
                        newHeader = "\n# There was no content - creating new \"Unreleased\" header.";
                    } else if (output[0].released) {
                        output.unshift({
                            version: "Unreleased",
                            released: false,
                            date: null,
                            link: null,
                            content: {}
                        });
                        newHeader = " - creating new \"Unreleased\" header.";
                    }

                    // Generate update edit message
                    var msg = "\n# Please enter what you have " + verb + " in this new version. Lines\n# starting with '#' will be ignored and an empty message aborts\n# the update. Multiple lines will be treated as multiple " + past + ".";
                    if (output.length > 1) {
                        msg += "\n# Currently on version " + output[1].version;
                    }
                    msg += newHeader;
                    msg += "\n#";

                    // Create .UPDATE_EDITMSG file with above contents and open $EDITOR
                    fs.writeFile(".UPDATE_EDITMSG", msg, function(err) {
                        if (err) {
                            changelog.display("Could not create temporary file in " + process.cwd(), "fatal");
                        } else {
                            editor(".UPDATE_EDITMSG", function(code, sig) {

                                // Get the content from the file
                                fs.readFile(".UPDATE_EDITMSG", "utf8", function(err, contents) {
                                    if (err) {
                                        changelog.display("Could not read from temporary file in " + process.cwd(), "fatal");
                                    } else {

                                        // Delete/clean-up the temporary file
                                        fs.unlink(".UPDATE_EDITMSG");

                                        // Perform validation on update contents
                                        var lines = contents.split("\n"); // Seperate into newlines
                                        var items = []; // An array of the actual items to add
                                        for (var i = 0; i < lines.length; i++) {

                                            // Ignore lines with absolutely no content or start with "#"
                                            if (lines[i].length > 0 && lines[i].split(" ").join("").split("")[0] !== "#") {
                                                items.push(lines[i]);
                                            }

                                        }

                                        // Abort if no content
                                        if (items.length === 0) {
                                            changelog.display("No message was supplied so the update was aborted");
                                        } else {

                                            // Make sure header exists
                                            if (!output[0].content[header]) {
                                                output[0].content[header] = [];
                                            }

                                            // For each update item, add it to the changelog
                                            for (var i = 0; i < items.length; i++) {
                                                output[0].content[header].push(items[i]);
                                            }

                                            // Stringify and save to file
                                            changelog.stringify(output, function(err, data) {
                                                fs.writeFile("CHANGELOG.md", data, function(err) {
                                                    if (err) {
                                                        changelog.display("Could not write updated changelog", "fatal");
                                                    } else {

                                                        // Make sure pluralisation of "item" is correct
                                                        if (items.length === 1) {
                                                            changelog.display("Added " + items.length + " item to \"" + header + "\"");
                                                        } else {
                                                            changelog.display("Added " + items.length + " items to \"" + header + "\"");
                                                        }

                                                    }
                                                });
                                            });

                                        }

                                    }

                                });

                            });
                        }
                    });

                }

            });

        }

    });

};
