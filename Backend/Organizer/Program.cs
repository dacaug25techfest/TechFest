using Microsoft.EntityFrameworkCore;
using Organizer.Data;
using Organizer.Repositories;
using Organizer.Services;
//using Steeltoe.Discovery.Client;

var builder = WebApplication.CreateBuilder(args);

//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DI
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<OrganizerService>();

// Eureka
//builder.Services.AddDiscoveryClient(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

// Eureka middleware
//app.UseDiscoveryClient();

app.UseRouting();
app.MapControllers();
app.Run();
