package com.sbelusky.spring_boot_library.controller;

import com.sbelusky.spring_boot_library.entity.Book;
import com.sbelusky.spring_boot_library.responsemodels.ShelfCurrentLoansResponse;
import com.sbelusky.spring_boot_library.service.BookService;
import com.sbelusky.spring_boot_library.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin("https://localhost:3000")
public class BookController {
    private BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader(value="Authorization") String token, @RequestParam Long bookId) throws Exception{
        return bookService.checkoutBook(ExtractJWT.payloadJWTExtraction(token, "\"sub\""),bookId);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean ischeckedoutBookByUser(@RequestHeader(value="Authorization") String token, @RequestParam Long bookId){
        return bookService.checkoutBookByUser(ExtractJWT.payloadJWTExtraction(token, "\"sub\""),bookId);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(@RequestHeader(value="Authorization") String token){
        return bookService.currentLoansCount(ExtractJWT.payloadJWTExtraction(token, "\"sub\""));
    }

    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> currentLoans(@RequestHeader(value = "Authorization") String token)
            throws Exception
    {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoans(userEmail);
    }

    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader(value = "Authorization") String token,
                           @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.returnBook(userEmail, bookId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestHeader(value = "Authorization") String token,
                          @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.renewLoan(userEmail, bookId);
    }


}
