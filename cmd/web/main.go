package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// Создаем Gin-роутер
	r := gin.Default()

	// Добавляем middleware для настройки CORS
	r.Use(func(c *gin.Context) {
		// Указываем разрешенные источники (например, ваш фронтенд)
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	// Путь к статическим файлам
	staticDir := "/home/vtoroy/GolandProjects/web_gateway/static"

	// Статические файлы
	r.Static("/static", staticDir)

	r.GET("/create-profile", func(c *gin.Context) {
		c.File(staticDir + "/profile.html")
	})

	// Обработка запроса на корень, например для SPA
	r.GET("/", func(c *gin.Context) {
		c.File(staticDir + "/index.html")
	})

	// Прокси для API запросов
	//// Прокси для профилей
	//r.Any("/api/profiles/*action", func(c *gin.Context) {
	//	c.Redirect(http.StatusMovedPermanently, "http://127.0.0.1:8082"+c.Request.URL.Path)
	//})
	//
	//// Прокси для авторизации
	//r.Any("/api/auth/*action", func(c *gin.Context) {
	//	c.Redirect(http.StatusMovedPermanently, "http://127.0.0.1:8081"+c.Request.URL.Path)
	//})

	// Запуск сервера
	log.Println("Starting web gateway on :8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Error starting gateway: %v", err)
	}
}
