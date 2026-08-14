extends Node

# Character properties for life simulation
var character_name: String = "Jogador"
var age: int = 25
var energy: float = 100.0
var hunger: float = 0.0
var happiness: float = 50.0
var money: float = 1000.0

# Needs decay rates (per second)
const ENERGY_DECAY = 0.1
const HUNGER_INCREASE = 0.08
const HAPPINESS_DECAY = 0.05

# References
var game_manager

func _ready() -> void:
	set_process(true)
	print("Personagem %s inicializado!" % character_name)

func _process(delta: float) -> void:
	_update_needs(delta)
	_check_critical_conditions()

func _update_needs(delta: float) -> void:
	energy = max(0, energy - ENERGY_DECAY * delta)
	hunger = min(100, hunger + HUNGER_INCREASE * delta)
	happiness = max(0, happiness - HAPPINESS_DECAY * delta)

func _check_critical_conditions() -> void:
	if energy <= 0:
		print("%s está exausto!" % character_name)
	if hunger >= 100:
		print("%s está passando fome!" % character_name)
	if happiness <= 0:
		print("%s está depressivo!" % character_name)

func interact() -> void:
	print("%s interagiu!" % character_name)

func work(wage: float) -> void:
	if energy >= 20:
		money += wage
		energy -= 20
		happiness += 5
		print("%s trabalhou e ganhou $%f" % [character_name, wage])
	else:
		print("%s está muito cansado para trabalhar!" % character_name)

func eat() -> void:
	if money >= 10:
		money -= 10
		hunger = max(0, hunger - 30)
		happiness += 10
		print("%s comeu comida" % character_name)
	else:
		print("%s não pode pagar por comida!" % character_name)

func sleep() -> void:
	energy = min(100, energy + 30)
	happiness += 5
	print("%s dormiu" % character_name)

func set_game_manager(manager) -> void:
	game_manager = manager
