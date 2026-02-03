using Microsoft.EntityFrameworkCore;
using Organizer.Data;
using Organizer.Repositories;
using Organizer.Services;
//using Steeltoe.Discovery.Client;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173") // React URL
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Register DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("DefaultConnection")
        )
    )
);



// Add services to the container.

// Configure JSON serialization to use camelCase
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS - Configure for React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

//builder.Services.AddScoped<OrganizerService>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<OrganizerService>();




var app = builder.Build();

app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS - MUST be before UseRouting and MapControllers
app.UseCors("AllowReactApp");

// Use Steeltoe Discovery Client
//app.UseDiscoveryClient();

//app.UseHttpsRedirection();

app.UseRouting();

//app.UseAuthorization();

app.MapControllers();

app.Run();
