# Базовый образ
FROM golang:1.20-alpine

# Установка зависимостей
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

# Копирование исходного кода
COPY . .

# Сборка бинарного файла
RUN go build -o web_gateway ./cmd/web/main.go

# Установка переменной окружения
ENV PORT=8080

# Запуск веб-сервера
CMD ["./web_gateway"]
