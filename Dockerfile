FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY rakuten02.Core/rakuten02.Core.csproj rakuten02.Core/
COPY rakuten02.Web/rakuten02.Web.csproj rakuten02.Web/
RUN dotnet restore rakuten02.Web/rakuten02.Web.csproj

COPY rakuten02.Core/ rakuten02.Core/
COPY rakuten02.Web/ rakuten02.Web/
RUN dotnet publish rakuten02.Web/rakuten02.Web.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "rakuten02.Web.dll"]
