// Dependencies
var fs = require("fs");
var moment = require("moment");
var colors = require("colors/safe");

module.exports = function() {

    // Read in the changelog
    fs.readFile("CHANGELOG.md", "utf8", function(err, data) {
        if (err) {
            changelog.display(null, "fileNotFound");
        } else {

            // Parse the changelog
            changelog.parse(data, function(err, docs) {
                if (err) {
                    changelog.display(null, "fileNotFound");
                } else {

                    // The final status information
                    var statusString = "";

                    // Get information about the changelog
                    if (!docs[0].released) {
                        if (docs.length > 1) {
                            statusString += "There have been " + (docs.length - 1) + " versions released";
                            statusString += "\nThe most recent of these being v" + docs[1].version + " from " + moment(docs[1].date).fromNow();
                        } else {
                            statusString += "The changelog has no releases to show";
                        }

                        // Check whether there is any unreleased content
                        if (docs[0].content) {

                            statusString += "\n\nUnreleased content:\n  (use \"changelog bump [version | patch | minor | major]\" to release)\n";

                            // Loop over the content
                            for (var key in docs[0].content) {
                                if (docs[0].content.hasOwnProperty(key)) {

                                    // Contain the inner string of the item
                                    var itemString = "";

                                    itemString += "\n  " + key + ":";
                                    for (var i = 0; i < docs[0].content[key].length; i++) {
                                        itemString += "\n    - " + docs[0].content[key][i];
                                        if (i === (docs[0].content[key].length - 1)) {
                                            itemString += "\n";
                                        }
                                    }

                                    // Add the item string to the status string with colors
                                    switch (key) {
                                        case "Added":
                                            statusString += colors.green(itemString);
                                            break;
                                        case "Changed":
                                            statusString += colors.yellow(itemString);
                                            break;
                                        case "Deprecated":
                                            statusString += colors.grey(itemString);
                                            break;
                                        case "Removed":
                                            statusString += colors.red(itemString);
                                            break;
                                        case "Fixed":
                                            statusString += colors.blue(itemString);
                                            break;
                                        case "Security":
                                            statusString += colors.magenta(itemString);
                                            break;
                                        default:
                                            statusString += itemString;
                                            break;
                                    }

                                }
                            }

                        } else {
                            statusString += "\nThere is no content in \"Unreleased\" to show";
                        }

                    } else {

                        if (docs.length === 1) {
                            statusString += "There has been " + docs.length + " version released";
                        } else if (docs.length > 1) {
                            statusString += "There have been " + docs.length + " versions released";
                        }

                        if (docs.length > 0) {
                            statusString += "\nThe most recent of these being v" + docs[0].version + " from " + moment(docs[0].date).fromNow();
                        } else {
                            statusString += "The changelog has no releases to show";
                        }
                    }

                    // Write it to the console
                    console.log(statusString);

                }
            });

        }

    });

};
