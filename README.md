

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
- task->setStatus([notStarted | goingToStorage | goingToLoadingArea | carryingToLoadingArea | carryingToStorage | complete])
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
- Unload cargo to storage
    + create / scan an item
        * creates a new item (if doesn't exist yet)
    + transfer to storage
        * manual, or with call crane -button
    + save location
        * save location to DB once item is put in store
    + confirm unload complete
- Pick up item from storage
    + go to the iteam
        * show map with own location, crane location and item location
        * drive crane to the item location
    + carry item to loading area
        * manual, or with call crane -button
    + remove item from storage
        * deletes the item from DB
- Call crane to own location
    + get location of the watch / location beacon
    + set crane target to the location
    + drive crane to the location

