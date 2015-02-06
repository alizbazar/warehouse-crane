

MANAGEMENT SITE FRONTEND: /
API ENDPOINT: /api/

# Functionality available to the watch (usage API):
- getStoredItems()
- getNextTask() -> task
- listAllTasks() -> summary {}?
- task->getStatus() -> [notStarted | goingToStorage | goingToLoadingArea | carryingToLoadingArea | carryingToStorage | complete]
- task->setStatus(String status)
- object Item {itemName, location}
- object Task {itemName, taskName [getItem | storeItem | storeLoad]}
- createNewItem({itemName}) -> item

# Additionally available for management:
- createTask(object)
- deleteTask(object)
- setHook({address, action [itemCreated | itemStored | itemPickedUp | itemReleased]})

# Management site functionality
- list items in store
- create, list, delete tasks
- visualize storage floor?

