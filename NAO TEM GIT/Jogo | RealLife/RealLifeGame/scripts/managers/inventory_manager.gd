extends Node

# Inventory management for items, equipment, etc.
var items: Dictionary = {}

func _init() -> void:
	print("InventoryManager initialized")

func add_item(item_id: String, quantity: int = 1) -> void:
	if items.has(item_id):
		items[item_id] += quantity
	else:
		items[item_id] = quantity
	print("Added %d x %s to inventory" % [quantity, item_id])

func remove_item(item_id: String, quantity: int = 1) -> bool:
	if items.has(item_id) && items[item_id] >= quantity:
		items[item_id] -= quantity
		if items[item_id] <= 0:
			items.erase(item_id)
		print("Removed %d x %s from inventory" % [quantity, item_id])
		return true
	else:
		print("Not enough %s in inventory" % item_id)
		return false

func get_item_count(item_id: String) -> int:
	return items.get(item_id, 0)

func has_item(item_id: String, quantity: int = 1) -> bool:
	return items.get(item_id, 0) >= quantity

func get_total_items() -> int:
	var total = 0
	for quantity in items.values():
		total += quantity
	return total

func clear_inventory() -> void:
	items.clear()
	print("Inventory cleared")
