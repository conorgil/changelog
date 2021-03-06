#!/usr/bin/env node

// Load all required files
var requireDir = require("require-dir");
changelog = requireDir("./changelog", {
    recurse: true
});

// If called as a command line app
if (require.main === module) {

    // Remove first two unneeded CLI args
    process.argv.splice(0, 2);

    if (process.argv.length === 0) {

        // No command line arugments specified, show the docs
        changelog.public.docs();

    } else {

        // Command line arguments specified, go through them
        switch (process.argv[0]) {

            // Show the help
            case "help":
                changelog.public.docs();
                break;

                // Initialize a blank changelog file
            case "init":
                changelog.public.init();
                break;

                // Destroy any changelog file
            case "destroy":
                changelog.public.destroy();
                break;

            case "parse":
                if (process.argv[1]) {
                    changelog.public.parse(process.argv[1]);
                } else {
                    changelog.public.parse();
                }
                break;

                // A core changelog function
            case "add":
            case "change":
            case "deprecate":
            case "remove":
            case "fix":
            case "secure":
                changelog.public.update(process.argv[0]);
                break;

                // Bump the version number
            case "bump":
                changelog.public.bump(process.argv[1]);
                break;

                // Copy the current version to the clipboard
            case "copy":
                changelog.public.copy();
                break;

                // GitHub releases integration
            case "release":
                changelog.public.release();
                break;

                // Show the changelog status
            case "status":
                changelog.public.status();
                break;

                // Unavailable functionality
                // case null:
                // changelog.display("'"  + process.argv[0] + "' is not available yet. Sorry :/");

            default:
                // Unrecognised command supplied, show error
                changelog.display("'" + process.argv[0] + "' is not a changelog command. See 'changelog help'.");

        }

    }

} else {

    // Called as a module, export API functions
    exports.parse = changelog.parse;
    exports.stringify = changelog.stringify;

}
