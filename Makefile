NAME = camagru

all : ${NAME}

${NAME} :
	docker compose up --build -d

console :
	docker compose up --build

clean :
	docker compose down

fclean :
	docker compose down
	docker image rm $$(docker images -q)

cleanVolume :
	docker volume rm camagru_db_data

re : fclean all

.PHONY: all clean fclean re