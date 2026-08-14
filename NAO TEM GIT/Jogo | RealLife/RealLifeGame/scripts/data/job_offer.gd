extends Node

# Job offer data structure
var job_title: String
var company: String
var salary_min: int
var salary_max: int
var description: String
var requirements: Array
var duration: String = "Full-time"
var location: String = "Remote"
var is_preferred: bool = false

func _init(title: String, company_name: String, min_salary: int, max_salary: int, desc: String, reqs: Array) -> void:
	job_title = title
	company = company_name
	salary_min = min_salary
	salary_max = max_salary
	description = desc
	requirements = reqs

func get_salary_range() -> String:
	return "$%d - $%d per year" % [salary_min, salary_max]

func get_requirements_text() -> String:
	return String.join(requirements, ", ")
