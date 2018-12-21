FROM microsoft/dotnet:2.1-runtime AS base
WORKDIR /app

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY DoorOpenConsole/DoorOpenConsole.csproj DoorOpenConsole/
RUN dotnet restore DoorOpenConsole/DoorOpenConsole.csproj
COPY . .
WORKDIR /src/DoorOpenConsole
RUN dotnet build DoorOpenConsole.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish DoorOpenConsole.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "DoorOpenConsole.dll"]
