using Microsoft.EntityFrameworkCore;
using Organizer.Data;
using Organizer.Repositories;
using Organizer.Services;
using Steeltoe.Discovery.Client;

var builder = WebApplication.CreateBuilder(args);

/* -------------------- CORS -------------------- */
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

/* -------------------- DB CONTEXT -------------------- */
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("DefaultConnection")
        )
    )
);

/* -------------------- CONTROLLERS & JSON -------------------- */
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy =
            System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true;
    });

/* -------------------- SWAGGER -------------------- */
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

/* -------------------- EUREKA (STEELTOE) -------------------- */
builder.Services.AddDiscoveryClient(builder.Configuration);

/* -------------------- DI -------------------- */
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<OrganizerService>();

var app = builder.Build();

/* -------------------- MIDDLEWARE -------------------- */
app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

/* -------------------- EUREKA MIDDLEWARE -------------------- */
app.UseDiscoveryClient();

app.UseRouting();

app.MapControllers();
app.Run();
