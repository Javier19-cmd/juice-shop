/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { environment } from '../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'
import { UserService } from '../Services/user.service'

@Injectable({
  providedIn: 'root'
})
export class ProductReviewService {
  private readonly hostServer = environment.hostServer
  private readonly host = this.hostServer + '/rest/products'

  constructor (private readonly http: HttpClient, private readonly userService: UserService) {
    console.log('UserService initialized:', this.userService);
  }

  get (id: number) {
    return this.http.get(`${this.host}/${id}/reviews`).pipe(
      map((response: any) => response.data), catchError((err: Error) => {
        throw err
      })
    )
  }

  create (id: number, review: { message: string, author: string }) {
    // Log the review creation
    this.userService.logEvent('Review created', 'medium', { productId: id, author: review.author, message: review.message });
    return this.http.put(`${this.host}/${id}/reviews`, review).pipe(map((response: any) => response.data),
      catchError((err) => { throw err })
    )
  }

  patch (review: { id: string, message: string }) {
    return this.http.patch(this.host + '/reviews', review).pipe(map((response: any) => response.data), catchError((err) => { throw err }))
  }

  like (_id?: string) {
    console.log("Liked")
    // Log the like action
    this.userService.logEvent('Review liked', 'low', { reviewId: _id, email: localStorage.getItem('email') });
    console.log('UserService:', this.userService);
    return this.http.post(this.host + '/reviews', { id: _id }).pipe(map((response: any) => response.data), catchError((err) => { throw err }))
  }
}
