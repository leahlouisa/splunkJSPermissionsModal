# splunkJSPermissionsModal

I didn't write Modal.js.  All credit goes to the Splunk Dev for All app on Splunkbase.

Just put these two files in the /appserver/static directory of any app, restart the SH (or use /en-US/_bump), and there will be a Help menu item to show people what groups they need to be in to see the data in a dashboard.  Requires there to be a lookup table called indexToADGroup.csv with global read permissions (or name it whatever you want by editing line 26 of dashboard.js).
