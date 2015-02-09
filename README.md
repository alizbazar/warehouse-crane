

MANAGEMENT SITE FRONTEND: /
API ENDPOINT: /api/

# Prerequisits

- Install Mongo: `brew update && brew install mongodb`
- Install NPM: `brew install npm`


# Running the server

    First, start the database locally, run 'mongod --dbpath ~/dev/db', where ~/dev/db is the location of the directory where you want to save the database

    To run the server, run `node web`



# Functionality available to the watch (usage API):
- object Task {itemName, taskName [getItem | storeItem | unloadToStore]}
- getNextTask() -> task
- task->setStatus([goingToStorage | leavingStorage | stored])
- object Item {itemName, location}
- createNewItem({itemName, itemData}) -> item
- item->setLocation(location)

- listAllTasks() -> summary {count, tasks[]} ???
- task->getStatus() -> status
- getStoredItems()

# Additionally available for management:
- createTask(object)
- deleteTask(object)
- setHook({url, action [itemCreated | itemStored | itemPickedUp | itemReleased]})

# Management site functionality
- list items in store
- create, list, delete tasks
- visualize storage floor?

# Watch Functionality
- Store incoming cargo [START] {incomingStart}
    1. [Select an item] -> [Item XYZ] {incomingSelect}
        * [SELECT] (gray, turns green when close by)
        * -> creates a new item (if doesn't exist yet)
    2. [Transfer item to storage] {incomingTransfer}
        * [SAVE LOCATION]
        * manual, or with call crane -button
        * -> save location to DB once item is put in store
    3. [More items to store?] {incomingMore}
        * [NO] -> next task
        * [YES] -> Go to 1.
    + [Select another item?]
- Get item from storage [START] {outgoingStart}
    1. Map view - display item ID {outgoingMap}
        * show map with own location, crane location and item location
        * drive crane to the item location
        * [SELECT] (gray, turns green when close by)
    2. [Transfer item to loading area] {outgoingTransfer}
        * [TRANSFER COMPLETE]
        * manual, or with call crane -button
        * -> remove item from storage
- Call crane to own location
    + get location of the watch / location beacon
    + set crane target to the location
    + drive crane to the location
- Drive crane to target location
    + item location when picking up an item
    + loading area when unloading cargo



#####  INCOMING_CARGO ####
# Run curl on commandline (top left)

curl -i -X POST -d "name=INCOMING_CARGO" http://localhost:5000/api/task/create





#####  GET ITEM ####

# 1. Copy latest ITEM_CREATED id to clipboard
# 2. Replace the id below from clipboard
# 3. Run curl on commandline (top left)

curl -i -X POST -d "name=GET_ITEM&itemId=54d741f3e24b2bbb4c356aa8" http://localhost:5000/api/task/create


#####  CREATE TASKS AUTOMATICALLY ####

curl -i -X POST http://localhost:5000/api/generateMoreTasks


