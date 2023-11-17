package de.ahrens.backend.user;

import de.ahrens.backend.security.JwtService;
import de.ahrens.backend.user.model.LoginCreationData;
import de.ahrens.backend.user.model.LoginData;
import de.ahrens.backend.user.model.Token;
import de.ahrens.backend.user.model.UserModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;

@RestController
@RequestMapping()
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("api/user/register")
    public UserModel postNewUser(@RequestBody LoginCreationData loginCreationData) throws ResponseStatusException {
            if (loginCreationData.getPassword().equals(loginCreationData.getPasswordAgain())) {
                loginCreationData.setPassword(passwordEncoder.encode(loginCreationData.getPassword()));
                return userService.createUser(loginCreationData);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
            }
    }

    @PostMapping("/api/user/login")
    public Token login(@RequestBody LoginData loginData) throws ResponseStatusException {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginData.getUsername(), loginData.getPassword()));
            Token token = new Token();
            token.setToken(jwtService.createToken(new HashMap<>(), loginData.getUsername()));
            return token;
        } catch (ResponseStatusException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }
}
