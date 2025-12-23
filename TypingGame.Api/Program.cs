using Microsoft.EntityFrameworkCore;
using TypingGame.Api.Data;
using TypingGame.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cache
// For production, use Redis:
// builder.Services.AddStackExchangeRedisCache(options => { options.Configuration = builder.Configuration.GetConnectionString("Redis"); });
builder.Services.AddDistributedMemoryCache(); // Dev mode

// Database
// Using In-Memory for initial dev speed, or change to PostgreSQL
// builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseInMemoryDatabase("TyposaurDb"));

// Domain Services
builder.Services.AddSingleton<WpmCalculator>();
builder.Services.AddSingleton<AntiCheatService>();
builder.Services.AddScoped<GameSessionService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient",
        policy => policy.WithOrigins("http://localhost:5173") // Vite default port
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowClient");

app.UseAuthorization();

app.MapControllers();

app.Run();
