extends Node

# Notification system for game events
signal notification_shown(message, type)
signal notification_dismissed(message)

var notifications: Array = []

func _init() -> void:
	print("NotificationManager initialized")

func show_notification(message: String, type: String = "info", duration: float = 3.0) -> void:
	var notification = {
		"message": message,
		"type": type,
		"duration": duration,
		"timer": 0.0
	}
	notifications.append(notification)
	emit_signal("notification_shown", message, type)
	print("Notification shown: %s [%s]" % [message, type])

func dismiss_notification(index: int) -> void:
	if index >= 0 && index < notifications.size():
		var message = notifications[index]["message"]
		notifications.remove_at(index)
		emit_signal("notification_dismissed", message)
		print("Notification dismissed: %s" % message)

func get_current_notifications() -> Array:
	return notifications.duplicate()

func clear_notifications() -> void:
	notifications.clear()
	print("All notifications cleared")
