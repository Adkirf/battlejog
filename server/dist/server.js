"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Node imports.
var path_1 = __importDefault(require("path"));
// Library imports.
var express_1 = __importDefault(require("express"));
var ws_1 = __importDefault(require("ws"));
var cors = require("cors");
var dotenv = require("dotenv");
dotenv.config();
var jwt = require("jsonwebtoken");
var Login_1 = require("./Login");
// Our collection players.  Each element is an object: { pid, score, stillPlaying }
var players = {};
var queue;
// Construct Express server for client resources.
var app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.json());
app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port ".concat(process.env.PORT || 3000));
});
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../client/build")));
app.get("/game", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "../../client/build/index.html"));
});
app.get("/login", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "../../client/build/index.html"));
});
app.put("/api/signin", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var login, users, isAvailable_1, user, jwtToken, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                login = new Login_1.Login();
                return [4 /*yield*/, login.getUsers()];
            case 1:
                users = _a.sent();
                isAvailable_1 = true;
                users.forEach(function (user) {
                    if (user.username === req.body.username) {
                        isAvailable_1 = false;
                    }
                });
                if (!isAvailable_1) return [3 /*break*/, 3];
                return [4 /*yield*/, login.signinUser(req.body.username, req.body.password)];
            case 2:
                user = _a.sent();
                jwtToken = jwt.sign(user, process.env.JWT_SECRET);
                res.status(200).json({ jwtToken: jwtToken, user: user });
                return [3 /*break*/, 4];
            case 3:
                res.status(300).json({ msg: "username already exists" });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                res.status(400).json(err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.put("/api/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var login, user, jwtToken, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                login = new Login_1.Login();
                return [4 /*yield*/, login.getUser(req.body.username, req.body.password)];
            case 1:
                user = _a.sent();
                jwtToken = jwt.sign(user, process.env.JWT_SECRET);
                res.status(200).json({ jwtToken: jwtToken, user: user });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(300).json(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
var wsServer = new ws_1.default.Server({ port: 8080 }, function () {
    console.log("BattleJong WebSocket server ready");
});
wsServer.on("connection", function (socket) {
    socket.on("message", function (inMsg) {
        console.log("Message: ".concat(inMsg));
        var msgParts = inMsg.toString().split("_");
        var message = msgParts[0];
        var pid = msgParts[1];
        switch (message) {
            case "singleplayer":
                var tempPid = "pid".concat(new Date().getTime());
                socket.send("connected_".concat(tempPid));
                players[tempPid] = { score: 0, stillPlaying: true, client: socket, username: pid, opponent: "" };
                var shuffledLayout = shuffle();
                players[tempPid].layout = JSON.stringify(shuffledLayout);
                socket.send("start_".concat(JSON.stringify(shuffledLayout)));
                break;
            case "multiplayer":
                var playerPid = Object.keys(players).find(function (existingPid) {
                    return players[existingPid].username === pid;
                });
                if (!playerPid || !players[playerPid].stillPlaying) {
                    console.log(!playerPid);
                    console.log(players[playerPid ? playerPid : "0"]);
                    console.log(queue !== playerPid);
                    playerPid = playerPid ? playerPid : "pid".concat(new Date().getTime());
                    socket.send("connected_".concat(playerPid));
                    players[playerPid] = { score: 0, stillPlaying: true, client: socket, username: pid, opponent: "" };
                    var isInQueue = queuePlayer(playerPid);
                    if (!isInQueue) {
                        var shuffledLayout_1 = shuffle();
                        players[playerPid].layout = JSON.stringify(shuffledLayout_1);
                        players[players[playerPid].opponent].layout = JSON.stringify(shuffledLayout_1);
                        players[players[playerPid].opponent].client.send("start_".concat(JSON.stringify(shuffledLayout_1)));
                        socket.send("start_".concat(JSON.stringify(shuffledLayout_1)));
                    }
                }
                else {
                    socket.send("connected_".concat(playerPid));
                    if (queue !== playerPid) {
                        var _a = players[playerPid], layout_1 = _a.layout, score = _a.score, opponent_1 = _a.opponent;
                        var opponentscore = opponent_1 ? players[opponent_1].score : 0;
                        socket.send("session_".concat(layout_1, "_").concat(score, "_").concat(opponentscore));
                    }
                }
                break;
            case "match":
                players[pid].score += parseInt(msgParts[2]);
                players[pid].layout = msgParts[3];
                if (players[pid].opponent) {
                    players[players[pid].opponent].client.send("update_".concat(players[pid], "_").concat(players[pid].score, "}}"));
                }
                break;
            case "done":
                var player = players[pid];
                var opponent = players[players[pid].opponent];
                player.stillPlaying = false;
                if (!opponent || !opponent.stillPlaying) {
                    var winningPid_1;
                    winningPid_1 = player.opponent ? (opponent.score ? pid : player.opponent) : pid;
                    player.client.send("gameOver_".concat(winningPid_1));
                    if (!opponent.stillPlaying) {
                        opponent.client.send("gameOver_".concat(winningPid_1));
                    }
                }
                break;
            case "quit":
                player = players[pid];
                opponent = players[players[pid].opponent];
                player.stillPlaying = false;
                var winningPid = opponent ? opponent : pid;
                socket.send("gameOver_".concat(winningPid));
                if (opponent) {
                    opponent.opponent = "";
                }
                break;
        }
    });
});
var queuePlayer = function (pid) {
    if (queue) {
        players[queue].opponent = pid;
        players[pid].opponent = queue;
        queue = undefined;
        return false;
    }
    else {
        queue = pid;
        return true;
    }
};
var layout = [
    [
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
];
function shuffle() {
    var cl = layout.slice(0);
    var numWildcards = 0;
    var numTileTypes = 42;
    for (var l = 0; l < cl.length; l++) {
        var layer = cl[l];
        for (var r = 0; r < layer.length; r++) {
            var row = layer[r];
            for (var c = 0; c < row.length; c++) {
                var tileVal = row[c];
                if (tileVal === 1) {
                    row[c] = (Math.floor(Math.random() * numTileTypes)) + 101;
                    if (row[c] === 101 && numWildcards === 3) {
                        row[c] = 102;
                    }
                    else {
                        numWildcards += numWildcards;
                    }
                }
            }
        }
    }
    return cl;
}
//# sourceMappingURL=server.js.map