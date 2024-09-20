NAME = camagru

all : ${NAME}

${NAME} :
	docker compose up --build -d

clean :
	docker compose down
	docker rmi $$(docker images -q)

fclean :
	docker compose down
	docker rmi $$(docker images -q)
	docker volume rm camagru_db_data

cleanVolume:
	docker volume rm camagru_db_data

re : fclean all

.PHONY: all clean fclean re